<?php

namespace App\Console\Commands\Keys;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;

class BuildAssetsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'keys:build
                            {--watch : Watch for changes and rebuild automatically}
                            {--dev : Build in development mode}
                            {--publish : Publish assets after building}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Build Keys UI package assets (CSS and JS)';

    protected string $packagePath;

    public function __construct()
    {
        parent::__construct();
        $this->packagePath = base_path('packages/keys-ui');
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if (!$this->packageExists()) {
            $this->error('Keys UI package not found at: ' . $this->packagePath);
            return 1;
        }

        $this->info('Building Keys UI assets...');

        
        if (!$this->dependenciesInstalled()) {
            $this->info('Installing package dependencies...');
            if (!$this->installDependencies()) {
                return 1;
            }
        }

        
        if ($this->option('watch')) {
            return $this->watchAssets();
        }

        if (!$this->buildAssets()) {
            return 1;
        }

        
        if ($this->option('publish')) {
            $this->publishAssets();
        }

        $this->info('✅ Keys UI assets built successfully!');
        return 0;
    }

    /**
     * Check if the package exists
     */
    protected function packageExists(): bool
    {
        return File::isDirectory($this->packagePath) &&
               File::exists($this->packagePath . '/package.json');
    }

    /**
     * Check if dependencies are installed
     */
    protected function dependenciesInstalled(): bool
    {
        return File::isDirectory($this->packagePath . '/node_modules');
    }

    /**
     * Install package dependencies
     */
    protected function installDependencies(): bool
    {
        $result = Process::path($this->packagePath)
            ->run(['npm', 'install']);

        if ($result->failed()) {
            $this->error('Failed to install dependencies:');
            $this->line($result->errorOutput());
            return false;
        }

        return true;
    }

    /**
     * Build the assets
     */
    protected function buildAssets(): bool
    {
        $command = $this->option('dev') ? 'npm run dev' : 'npm run build';

        $this->info("Running: {$command}");

        $result = Process::path($this->packagePath)
            ->run(explode(' ', $command));

        if ($result->failed()) {
            $this->error('Build failed:');
            $this->line($result->errorOutput());
            return false;
        }

        $this->line($result->output());
        return true;
    }

    /**
     * Watch assets for changes
     */
    protected function watchAssets(): int
    {
        $this->info('👀 Watching Keys UI assets for changes...');
        $this->info('🚀 Auto-deployment enabled - assets will be copied to public directory');
        $this->info('Press Ctrl+C to stop watching');

        
        $viteProcess = Process::path($this->packagePath)
            ->start(['npm', 'run', 'watch']);

        
        $distPath = $this->packagePath . '/dist';
        $publicPath = public_path('vendor/keys-ui');

        
        if (!File::isDirectory($publicPath)) {
            File::makeDirectory($publicPath, 0755, true);
        }

        $lastModified = [];

        while ($viteProcess->running()) {
            
            $files = ['keys-ui.umd.js', 'keys-ui.es.js', 'style.css'];

            foreach ($files as $file) {
                $distFile = $distPath . '/' . $file;

                if (File::exists($distFile)) {
                    $currentModified = File::lastModified($distFile);

                    if (!isset($lastModified[$file]) || $lastModified[$file] !== $currentModified) {
                        $lastModified[$file] = $currentModified;

                        
                        $targetFile = $file === 'keys-ui.umd.js' ? 'keys-ui.min.js' : $file;
                        $publicFile = $publicPath . '/' . $targetFile;

                        File::copy($distFile, $publicFile);
                        $this->line("✅ Deployed: {$targetFile}");

                        
                        if ($file === 'keys-ui.umd.js') {
                            File::copy($distFile, $publicPath . '/keys-ui.umd.js');
                        }
                    }
                }
            }

            
            usleep(500000);
        }

        return $viteProcess->exitCode();
    }

    /**
     * Publish built assets
     */
    protected function publishAssets(): void
    {
        $this->info('Publishing assets...');

        $this->call('vendor:publish', [
            '--tag' => 'keys-ui-assets',
            '--force' => true
        ]);
    }
}
