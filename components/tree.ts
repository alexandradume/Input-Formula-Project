interface NodeData {
  name: string;
}

export class TreeNode {
  data: NodeData;
  children: TreeNode[];
  indexInInput: number;

  constructor(data: NodeData, indexInput: number) {
    this.data = data;
    this.children = [];
    this.indexInInput = indexInput;
  }

  addChild(child: TreeNode): void {
    this.children.push(child);
  }

  static isNumeric(value: string): boolean {
    return !isNaN(Number(value));
  }

  static parseTreeFromString(input: string): TreeNode | null {
    //parses the input string into a TreeNode; takes each char one by one and creates a ierarchy of nodes that correspond
    //to the way the functions are placed
    const stack: TreeNode[] = [];
    let currentNumber = "";
    let currentFunction = "";

    let isLastSeparatorAClosingBracket = false;
    const specialCharsForNumbers = "[];.";

    let index = 0;
    input = input.trimEnd();

    //we analyze each char
    for (const char of input) {
      switch (char) {
        //precises cases for separators
        case "(": {
          //the open bracket must succede a function, so we push it on the stack
          if (currentFunction !== "") {
            const newNode = new TreeNode(
              { name: currentFunction },
              index - currentFunction.length
            );
            if (stack.length) {
              stack[stack.length - 1].addChild(newNode);
            }
            stack.push(newNode);
            currentFunction = "";
            currentNumber = "";
          }
          isLastSeparatorAClosingBracket = false;
          break;
        }
        case ",": {
          //commas succede numbers, so we add the number as child
          if (currentNumber !== "") {
            if (
              !(
                isLastSeparatorAClosingBracket && currentNumber.trim() === ""
              ) &&
              stack.length
            ) {
              stack[stack.length - 1].addChild(
                new TreeNode(
                  { name: currentNumber },
                  index - currentNumber.length
                )
              );
            }
            currentNumber = "";
            currentFunction = "";
          }
          isLastSeparatorAClosingBracket = false;
          break;
        }
        case ")": {
          //closing brackets succede numbers, so we add the number as a child
          if (currentNumber !== "" && stack.length) {
            if (
              !(
                isLastSeparatorAClosingBracket && currentNumber.trim() === ""
              ) &&
              stack.length
            ) {
              stack[stack.length - 1].addChild(
                new TreeNode(
                  { name: currentNumber },
                  index - currentNumber.length
                )
              );
            }
            currentNumber = "";
            currentFunction = "";
            if (index != input.length - 1) {
              stack.pop();
            }
          }
          isLastSeparatorAClosingBracket = true;
          break;
        }
        default: {
          //if the char is not a separator, then we form numbers or functions
          if (char == " ") {
            currentNumber += " ";
            currentFunction += " ";
          } else if (
            this.isNumeric(char) ||
            specialCharsForNumbers.includes(char)
          ) {
            currentNumber += char;
          } else {
            currentFunction += char;
          }

          //if it's the last index, even if the string does not represent a finished, correct function
          //we add the currentData as a child node name
          if (index == input.length - 1 && stack.length) {
            const currentData =
              currentNumber.length >= currentFunction.length
                ? currentNumber
                : currentFunction;
            stack[stack.length - 1].addChild(
              new TreeNode(
                { name: currentData },
                index - currentData.length + 1
              )
            );
          }
          break;
        }
      }
      //index in the input string
      index++;
    }
    //returns the main function with the right children
    return stack[0];
  }
}
