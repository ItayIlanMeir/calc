// tests go here; this will not be compiled when this package is used as an extension.

2. `pxt.json`(Valid JSON Configuration)

    ```json
{
    "name": "arcade-calculator",
    "version": "0.0.2",
    "description": "Build a Calculator",
    "dependencies": {
        "device": "*"
    },
    "files": [
        "main.blocks",
        "main.ts",
        "README.md",
        "assets.json",
        "arcade-calculator.ts"
    ],
    "testFiles": [
        "test.ts"
    ],
    "targetVersions": {
        "target": "2.0.15",
        "targetId": "arcade"
    },
    "supportedTargets": [
        "arcade"
    ],
    "preferredEditor": "blocksprj"
}

# Build an Interactive Calculator

### Step 1: Open the Calculator
Let's draw the calculator on the screen when the game starts.
Drag ``||calculator:show calculator||`` into ``||loops:on start||``.

```blocks
calculator.showCalculator()
    ```

### Step 2: Add a Movable Cursor
Now let's create a pointer sprite so the player can move around the buttons with the arrow keys.
Snap ``||calculator:enable calculator cursor at speed 100||`` inside ``||loops:on start||``.

```blocks
calculator.showCalculator()
calculator.enableCursor(100)
    ```

### Step 3: Draw Your Own Cursor (Optional)
Want to use a fish, a hand, or your own character instead of the default arrow?
Drag ``||calculator:set calculator cursor image to||`` into ``||loops:on start||`` and click the gray square to draw or pick a sprite from the Gallery!

```blocks
calculator.showCalculator()
calculator.enableCursor(100)
calculator.setCursorImage(img`
    . . . . . . 4 4 4 4 . . . . . .
    . . . . 4 4 5 5 5 4 4 . . . 4 4
    . . 4 4 5 5 5 5 5 5 4 4 . 4 5 4
    . 4 5 1 1 5 5 4 4 5 5 4 4 5 5 4
    4 5 5 1 f 5 5 4 4 5 5 5 5 5 5 4
    4 5 5 1 1 5 5 4 4 5 5 4 4 5 5 4
    . 4 5 5 5 5 5 5 5 5 4 4 . 4 5 4
    . . 4 4 5 5 5 5 5 4 4 . . . 4 4
    . . . . 4 4 4 4 4 4 . . . . . .
`)
    ```

### Step 4: Click Buttons with A
To let the player press the button under the cursor, grab ``||controller:on A button pressed||`` and put ``||calculator:click button under cursor||`` inside it.

```blocks
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    calculator.clickUnderCursor()
})
    ```

### Step 5: Add Sound Effects
Let's make the calculator beep whenever any button is pressed!
Drag ``||calculator:on calculator button pressed||`` onto the workspace and place ``||music:play tone Middle C for 1/2 beat||`` inside it.

```blocks
calculator.onButtonPressed(function (button) {
    music.play(music.tonePlayable(262, music.beat(BeatFraction.Half)), music.PlaybackMode.UntilDone)
})
    ```

### Step 6: Test Your Calculator! @unplugged
Use the **Arrow Keys** (or WASD) in the simulator to move your cursor over numbers and operators, and press **Spacebar / Z** to calculate equations!

```package
arcade - calculator=github: ItayIlanMeir / Arcade - Calculator#v0.0.2
    ```
    