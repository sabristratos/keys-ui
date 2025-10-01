<!DOCTYPE html>
<html>
<head>
    <title>Avatar Components Test</title>
    <keys:scripts />
</head>
<body>
    <div class="p-8 space-y-8">
        <h1 class="text-3xl font-bold mb-8">Avatar Components Test</h1>

        
        <section>
            <h2 class="text-xl font-semibold mb-4">Basic Avatars</h2>
            <div class="flex items-center space-x-4">
                
                <x-keys::avatar
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    name="John Doe"
                    alt="John Doe's profile picture"
                />

                
                <x-keys::avatar name="Jane Smith" />

                
                <x-keys::avatar />
            </div>
        </section>

        
        <section>
            <h2 class="text-xl font-semibold mb-4">Avatar Sizes</h2>
            <div class="flex items-center space-x-4">
                <div class="text-center">
                    <x-keys::avatar name="XS" size="xs" />
                    <p class="text-xs mt-1">xs</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="SM" size="sm" />
                    <p class="text-xs mt-1">sm</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="MD" size="md" />
                    <p class="text-xs mt-1">md</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="LG" size="lg" />
                    <p class="text-xs mt-1">lg</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="XL" size="xl" />
                    <p class="text-xs mt-1">xl</p>
                </div>
            </div>
        </section>

        
        <section>
            <h2 class="text-xl font-semibold mb-4">Avatar Shapes</h2>
            <div class="flex items-center space-x-4">
                <div class="text-center">
                    <x-keys::avatar name="Circle" shape="circle" />
                    <p class="text-xs mt-1">Circle</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="Square" shape="square" />
                    <p class="text-xs mt-1">Square</p>
                </div>
            </div>
        </section>

        
        <section>
            <h2 class="text-xl font-semibold mb-4">Avatar Colors</h2>
            <div class="flex flex-wrap gap-4">
                <div class="text-center">
                    <x-keys::avatar name="BR" color="brand" />
                    <p class="text-xs mt-1">Brand</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="SU" color="success" />
                    <p class="text-xs mt-1">Success</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="WA" color="warning" />
                    <p class="text-xs mt-1">Warning</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="DA" color="danger" />
                    <p class="text-xs mt-1">Danger</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="NE" color="neutral" />
                    <p class="text-xs mt-1">Neutral</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="RE" color="red" />
                    <p class="text-xs mt-1">Red</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="GR" color="green" />
                    <p class="text-xs mt-1">Green</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="BL" color="blue" />
                    <p class="text-xs mt-1">Blue</p>
                </div>
            </div>
        </section>

        
        <section>
            <h2 class="text-xl font-semibold mb-4">Avatar Status Indicators</h2>
            <div class="flex items-center space-x-4">
                <div class="text-center">
                    <x-keys::avatar name="ON" status="online" />
                    <p class="text-xs mt-1">Online</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="OF" status="offline" />
                    <p class="text-xs mt-1">Offline</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="AW" status="away" />
                    <p class="text-xs mt-1">Away</p>
                </div>
                <div class="text-center">
                    <x-keys::avatar name="BU" status="busy" />
                    <p class="text-xs mt-1">Busy</p>
                </div>
            </div>
        </section>

        
        <section>
            <h2 class="text-xl font-semibold mb-4">Avatar with Borders</h2>
            <div class="flex items-center space-x-4">
                <x-keys::avatar name="B1" border="true" />
                <x-keys::avatar name="B2" border="true" color="success" />
                <x-keys::avatar name="B3" border="true" status="online" />
            </div>
        </section>

        
        <section>
            <h2 class="text-xl font-semibold mb-4">Avatar Stacks</h2>

            <div class="space-y-6">
                
                <div>
                    <h3 class="text-lg font-medium mb-2">Default Stack</h3>
                    <x-keys::avatar.stack>
                        <x-keys::avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" name="John Doe" />
                        <x-keys::avatar name="Jane Smith" color="success" />
                        <x-keys::avatar name="Bob Johnson" color="warning" />
                        <x-keys::avatar name="Alice Brown" color="danger" />
                    </x-keys::avatar.stack>
                </div>

                
                <div>
                    <h3 class="text-lg font-medium mb-2">Large Stack</h3>
                    <x-keys::avatar.stack size="lg">
                        <x-keys::avatar name="Team" color="brand" />
                        <x-keys::avatar name="Lead" color="success" />
                        <x-keys::avatar name="Dev" color="blue" />
                        <x-keys::avatar name="QA" color="purple" />
                        <x-keys::avatar name="PM" color="orange" />
                    </x-keys::avatar.stack>
                </div>

                
                <div>
                    <h3 class="text-lg font-medium mb-2">Tight Spacing Stack</h3>
                    <x-keys::avatar.stack spacing="tight">
                        <x-keys::avatar name="T1" color="red" />
                        <x-keys::avatar name="T2" color="green" />
                        <x-keys::avatar name="T3" color="blue" />
                    </x-keys::avatar.stack>
                </div>

                
                <div>
                    <h3 class="text-lg font-medium mb-2">Right-to-Left Stack</h3>
                    <x-keys::avatar.stack direction="rtl">
                        <x-keys::avatar name="R1" color="teal" />
                        <x-keys::avatar name="R2" color="yellow" />
                        <x-keys::avatar name="R3" color="purple" />
                    </x-keys::avatar.stack>
                </div>
            </div>
        </section>

        
        <section>
            <h2 class="text-xl font-semibold mb-4">Mixed Examples</h2>
            <div class="space-y-4">
                
                <div>
                    <h3 class="text-lg font-medium mb-2">Team with Status</h3>
                    <x-keys::avatar.stack>
                        <x-keys::avatar name="Lead" status="online" color="brand" />
                        <x-keys::avatar name="Dev1" status="busy" color="success" />
                        <x-keys::avatar name="Dev2" status="away" color="warning" />
                        <x-keys::avatar name="QA" status="offline" color="danger" />
                    </x-keys::avatar.stack>
                </div>

                
                <div class="flex items-center space-x-4">
                    <x-keys::avatar name="Square Large" size="lg" shape="square" color="purple" />
                    <x-keys::avatar name="Circle Medium" size="md" shape="circle" color="teal" status="online" />
                    <x-keys::avatar name="Small Round" size="sm" shape="circle" color="orange" border="true" />
                </div>
            </div>
        </section>
    </div>
</body>
</html>