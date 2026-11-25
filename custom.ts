enum CalcButton {
    //% block="0"
    Zero,
    //% block="1"
    One,
    //% block="2"
    Two,
    //% block="3"
    Three,
    //% block="4"
    Four,
    //% block="5"
    Five,
    //% block="6"
    Six,
    //% block="7"
    Seven,
    //% block="8"
    Eight,
    //% block="9"
    Nine,
    //% block="+"
    Add,
    //% block="-"
    Subtract,
    //% block="X"
    Multiply,
    //% block="/"
    Divide,
    //% block="="
    Equals,
    //% block="C"
    Clear
}

//% color="#2b579a" weight=100 icon="\uf1ec" block="Calculator"
//% groups=['Setup & Visuals', 'Interaction & Input', 'Math & State', 'Events']
namespace calculator {
    let currentInput = ""
    let firstNumStr = ""
    let firstNum = 0
    let operator = ""
    let fullEquation = "0"
    let resetNext = false
    let visible = false

    let bodyColor = 11
    let screenColor = 7
    let numBtnColor = 13
    let opBtnColor = 4

    let cursorImg: Image = img`
        1 1 . . . . . .
        1 5 1 . . . . .
        1 5 5 1 . . . .
        1 5 5 5 1 . . .
        1 5 5 5 5 1 . .
        1 5 5 1 1 1 . .
        1 1 5 1 . . . .
        . . 1 1 . . . .
    `

    let displaySprite: Sprite = null
    let pointer: Sprite = null
    let btnSprites: Sprite[] = []
    let btnLabels: string[] = []

    let onButtonPressedHandler: (button: string) => void = null
    let onEqualsHandler: (answer: number, equation: string) => void = null

    const buttons = [
        ["7", "8", "9", "/"],
        ["4", "5", "6", "X"],
        ["1", "2", "3", "-"],
        ["C", "0", "=", "+"]
    ]

    const GRID_X = 28
    const GRID_Y = 34
    const BTN_W = 24
    const BTN_H = 18
    const GAP = 3

    function buttonToString(btn: CalcButton): string {
        switch (btn) {
            case CalcButton.Zero: return "0"
            case CalcButton.One: return "1"
            case CalcButton.Two: return "2"
            case CalcButton.Three: return "3"
            case CalcButton.Four: return "4"
            case CalcButton.Five: return "5"
            case CalcButton.Six: return "6"
            case CalcButton.Seven: return "7"
            case CalcButton.Eight: return "8"
            case CalcButton.Nine: return "9"
            case CalcButton.Add: return "+"
            case CalcButton.Subtract: return "-"
            case CalcButton.Multiply: return "X"
            case CalcButton.Divide: return "/"
            case CalcButton.Equals: return "="
            case CalcButton.Clear: return "C"
        }
        return ""
    }

    function refreshScreen() {
        if (!displaySprite) return
        const imgDisp = image.create(100, 14)
        imgDisp.fill(screenColor)
        const shown = fullEquation.length > 16 ? fullEquation.slice(fullEquation.length - 16) : fullEquation
        imgDisp.print(shown, 3, 3, 15)
        displaySprite.setImage(imgDisp)
    }

    // ==========================================
    // GROUP 1: SETUP & VISUALS
    // ==========================================

    /**
     * Draws the calculator body and buttons on screen
     */
    //% group="Setup & Visuals"
    //% block="show calculator"
    //% weight=100
    export function showCalculator() {
        if (visible) {
            hideCalculator()
        }
        visible = true

        const bg = image.create(160, 120)
        bg.fill(12)
        bg.fillRect(22, 4, 116, 112, bodyColor)
        bg.drawRect(22, 4, 116, 112, 1)
        bg.fillRect(28, 10, 104, 18, screenColor)
        bg.drawRect(28, 10, 104, 18, 15)
        scene.setBackgroundImage(bg)

        displaySprite = sprites.create(image.create(100, 14), SpriteKind.Food)
        displaySprite.setPosition(80, 19)
        displaySprite.z = 1

        btnSprites = []
        btnLabels = []
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const x = GRID_X + c * (BTN_W + GAP)
                const y = GRID_Y + r * (BTN_H + GAP)
                const label = buttons[r][c]

                let cBtn = numBtnColor
                if (label == "+" || label == "-" || label == "X" || label == "/") cBtn = opBtnColor
                else if (label == "=") cBtn = 8
                else if (label == "C") cBtn = 2

                const btnImg = image.create(BTN_W, BTN_H)
                btnImg.fill(cBtn)
                btnImg.drawRect(0, 0, BTN_W, BTN_H, 15)
                btnImg.print(label, 9, 5, 15)

                const btn = sprites.create(btnImg, SpriteKind.Player)
                btn.setPosition(x + Math.idiv(BTN_W, 2), y + Math.idiv(BTN_H, 2))
                btn.z = 1
                btnSprites.push(btn)
                btnLabels.push(label)
            }
        }

        if (pointer) {
            pointer.z = 10
        }
        refreshScreen()
    }

    /**
     * Removes the calculator sprites from the screen
     */
    //% group="Setup & Visuals"
    //% block="hide calculator"
    //% weight=90
    export function hideCalculator() {
        if (!visible) return
        visible = false
        if (displaySprite) displaySprite.destroy()
        for (let s of btnSprites) s.destroy()
        btnSprites = []
        btnLabels = []
        displaySprite = null
    }

    /**
     * Sets custom colors for the calculator theme
     */
    //% group="Setup & Visuals"
    //% block="set calculator colors body %body=colorindexpicker screen %screen=colorindexpicker numbers %num=colorindexpicker operators %op=colorindexpicker"
    //% body.defl=11 screen.defl=7 num.defl=13 op.defl=4
    //% weight=80
    export function setThemeColors(body: number, screen: number, num: number, op: number) {
        bodyColor = body
        screenColor = screen
        numBtnColor = num
        opBtnColor = op
        if (visible) {
            showCalculator()
        }
    }

    /**
     * Displays custom text on the calculator LCD screen
     */
    //% group="Setup & Visuals"
    //% block="show text %text on calculator screen"
    //% weight=70
    export function setScreenText(text: string) {
        fullEquation = text
        refreshScreen()
    }

    // ==========================================
    // GROUP 2: INTERACTION & INPUT
    // ==========================================

    /**
     * Creates a movable cursor sprite controlled with D-Pad / Arrow keys
     */
    //% group="Interaction & Input"
    //% block="enable calculator cursor at speed %speed"
    //% speed.defl=100
    //% weight=100
    export function enableCursor(speed: number = 100) {
        if (pointer) {
            pointer.z = 10
            controller.moveSprite(pointer, speed, speed)
            return
        }
        pointer = sprites.create(cursorImg, SpriteKind.Player)
        pointer.setPosition(80, 70)
        pointer.setStayInScreen(true)
        pointer.z = 10
        controller.moveSprite(pointer, speed, speed)
    }

    /**
     * Opens the sprite editor so you can draw or pick a custom cursor image
     */
    //% group="Interaction & Input"
    //% block="set calculator cursor image to %img=screen_image_picker"
    //% weight=95
    export function setCursorImage(img: Image) {
        cursorImg = img
        if (pointer) {
            pointer.setImage(cursorImg)
            pointer.z = 10
        }
    }

    /**
     * Uses an existing player sprite as the calculator cursor
     */
    //% group="Interaction & Input"
    //% block="use sprite %sprite=variables_get(mySprite) as calculator cursor"
    //% weight=94
    export function setCursorSprite(sprite: Sprite) {
        if (!sprite) return
        if (pointer && pointer != sprite) {
            pointer.destroy()
        }
        pointer = sprite
        pointer.setStayInScreen(true)
        pointer.z = 10
    }

    /**
     * Clicks whichever button the cursor is currently touching
     */
    //% group="Interaction & Input"
    //% block="click button under cursor"
    //% weight=90
    export function clickUnderCursor() {
        if (!pointer) return
        for (let i = 0; i < btnSprites.length; i++) {
            if (pointer.overlapsWith(btnSprites[i])) {
                pressKeyString(btnLabels[i])
                break
            }
        }
    }

    /**
     * Returns the label of the button the cursor is currently hovering over
     */
    //% group="Interaction & Input"
    //% block="button under cursor"
    //% weight=80
    export function hoveredButton(): string {
        if (!pointer) return ""
        for (let i = 0; i < btnSprites.length; i++) {
            if (pointer.overlapsWith(btnSprites[i])) {
                return btnLabels[i]
            }
        }
        return ""
    }

    // ==========================================
    // GROUP 3: MATH & STATE
    // ==========================================

    /**
     * Simulates pressing a specific calculator button from a dropdown
     */
    //% group="Math & State"
    //% block="press button %btn"
    //% weight=100
    export function pressButton(btn: CalcButton) {
        pressKeyString(buttonToString(btn))
    }

    function pressKeyString(key: string) {
        if (key == "") return
        if (onButtonPressedHandler) onButtonPressedHandler(key)

        if (key == "C") {
            clearCalculator()
        } else if (key == "+" || key == "-" || key == "X" || key == "/") {
            if (currentInput != "") {
                firstNum = parseFloat(currentInput)
                firstNumStr = currentInput
                operator = key
                currentInput = ""
                resetNext = false
                fullEquation = firstNumStr + " " + operator
                refreshScreen()
            }
        } else if (key == "=") {
            if (operator != "" && currentInput != "") {
                const secondNum = parseFloat(currentInput)
                let result = 0
                if (operator == "+") result = firstNum + secondNum
                else if (operator == "-") result = firstNum - secondNum
                else if (operator == "X") result = firstNum * secondNum
                else if (operator == "/") {
                    if (secondNum == 0) {
                        fullEquation = "Err: Div by 0"
                        refreshScreen()
                        currentInput = ""
                        firstNumStr = ""
                        operator = ""
                        return
                    }
                    result = firstNum / secondNum
                }
                const resStr = (result == Math.floor(result)) ? ("" + Math.floor(result)) : ("" + result)
                fullEquation = firstNumStr + " " + operator + " " + currentInput + " = " + resStr
                refreshScreen()
                currentInput = resStr
                firstNumStr = ""
                operator = ""
                resetNext = true
                if (onEqualsHandler) onEqualsHandler(result, fullEquation)
            }
        } else {
            if (resetNext) {
                currentInput = ""
                resetNext = false
            }
            currentInput = (currentInput == "0") ? key : (currentInput + key)
            if (operator != "") {
                fullEquation = firstNumStr + " " + operator + " " + currentInput
            } else {
                fullEquation = currentInput
            }
            refreshScreen()
        }
    }
    /**
    * Resets all calculator memory and sets the display back to 0
    */
    //% group="Math & State"
    //% block="clear calculator"
    //% weight=90
    export function clearCalculator() {
        currentInput = ""
        firstNumStr = ""
        firstNum = 0
        operator = ""
        resetNext = false
        fullEquation = "0"
        refreshScreen()
    }
    /**
    * Gets the current number or calculated answer as a number
    */
    //% group="Math & State"
    //% block="current number"
    //% weight=80
    export function currentNumber(): number {
        return parseFloat(currentInput) || 0
    }
    /**
    * Gets the full equation text currently shown on the screen
    */
    //% group="Math & State"
    //% block="current equation text"
    //% weight=70
    export function currentEquation(): string {
        return fullEquation
    }
    // ==========================================
    // GROUP 4: EVENTS
    // ==========================================
    /**
    * Runs code whenever any calculator button is pressed
    */
    //% group="Events"
    //% block="on calculator button $button pressed"
    //% draggableParameters="reporter"
    //% weight=100
    export function onButtonPressed(handler: (button: string) => void) {
        onButtonPressedHandler = handler
    }
    /**
    * Runs code whenever "=" finishes calculating an answer
    */
    //% group="Events"
    //% block="on equals calculated $answer $equation"
    //% draggableParameters="reporter"
    //% weight=90
    export function onEqualsCalculated(handler: (answer: number, equation: string) => void) {
        onEqualsHandler = handler
    }
}