<template>
  <v-container>
    <v-row align="center">
      <v-col>
        <div class="main-container">
          <div class="input-container">
            <div class="input-button-container">
              <v-text-field id="mainInput" class="mx-2 red-input" ref="myInput" v-model="searchText"
                @input="handleInputEvent" @keyup="handleArrowKeyPressEvent" @mouseup="handleMouseUpEvent"
                placeholder="Search items" spellcheck="false" />

              <m-tooltip top>
                <template v-slot:element>
                  <v-btn class="ms-7" small fab color="#627dff" dark @click.stop="handleButtonClick"
                    title="Activate extended view">
                    <v-icon> mdi-function-variant </v-icon>
                  </v-btn>
                </template>
                <template v-slot:message>
                  <div>{{ "Activate extended view" }}</div>
                </template>
              </m-tooltip>
            </div>
            <v-card class="mx-auto" :ripple="false" v-if="showList">
              <v-toolbar outlined rounded style="box-shadow: none">
                <v-toolbar-title style="font-size: 0.9rem; font-weight: bold">Write formula</v-toolbar-title>
                <v-spacer></v-spacer>
                <m-tooltip top>
                  <template v-slot:element>
                    <v-btn class="mx-2" fab x-small color="#627dff" dark @click="handleCloseList">
                      <v-icon dark> mdi-alpha-x </v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:message>
                    <div>{{ "Close extended view" }}</div>
                  </template>
                </m-tooltip>
              </v-toolbar>
              <v-list width="25rem" max-height="28rem" class="py-0" style="overflow-y: scroll">
                <template v-for="(item, index) in filteredList" @key="item.name">
                  <v-list-item class="pl-0" style="height: 5rem; font-size: 0.8rem" :key="item.name"
                    @click="handleClickItemList(item)" @mouseover="hoveredIndex = index">
                    <v-list-item-content>
                      <v-row style="height: 5rem">
                        <v-col cols="2" style="
                            background-color: #dfe8ff;
                            text-align: right;
                            color: #627dff;
                          ">
                          <v-icon> mdi-variable </v-icon>
                        </v-col>
                        <v-col>
                          <b><span style="font-size: 14px">
                              {{ item.name }}
                            </span></b>
                          {{ item.category }}
                          <div style="color: #9db8fc">
                            {{ getShortDescription(item.description.at(0)) }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
              <v-container width="25rem" style="background-color: #dfe8ff">
                <v-row style="height: 2.3rem">
                  <v-col cols="2" class="pa-0">
                    <m-tooltip bottom>
                      <template v-slot:element>
                        <v-btn small style="
                            min-width: 3.35rem;
                            min-height: 2.3rem;
                            border-radius: 0px;
                            box-shadow: none;
                          " color="#627dff" dark @click="handleCloseList">
                          <v-icon> mdi-check </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:message>
                        <div>{{ "Close extended view" }}</div>
                      </template>
                    </m-tooltip>
                  </v-col>
                  <v-col class="py-1 text-right">
                    <m-tooltip bottom>
                      <template v-slot:element>
                        <a style="font-size: 0.8rem" href="https://machinations.io/docs/math-js-functions"
                          target="_blank">Help Documentation</a>
                      </template>
                      <template v-slot:message>
                        <div>{{ "Do you want to know more about this?" }}</div>
                      </template>
                    </m-tooltip>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </div>
          <div class="divForBrackets" id="div" ref="div" v-if="showDiv">
            <v-row>
              <v-col align-start>
                <div id="syntaxDiv"></div>
              </v-col>
              <v-col class="text-end">
                <m-tooltip bottom>
                  <template v-slot:element>
                    <v-btn class="mx-2" fab x-small color="#627dff" dark @click.stop="displayExampleAndDescription">
                      <v-icon v-if="!isDivExampleExtended">
                        mdi-arrow-down-bold
                      </v-icon>
                      <v-icon v-if="isDivExampleExtended">
                        mdi-arrow-up-bold
                      </v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:message>
                    <div>
                      {{
                        isDivExampleExtended
                        ? "Minimize details"
                        : "Extend details"
                      }}
                    </div>
                  </template>
                </m-tooltip>
              </v-col>
            </v-row>
            <div v-if="showExampleDiv" id="showExampleDiv" class="example-div">
              <div>
                <div class="titleDiv">Example</div>
                <div>
                  {{ exampleDivText }}
                </div>
                <v-divider></v-divider>
                <div class="titleDiv">Description</div>
                <div style="padding-right: 0.1rem">
                  {{ descriptionDivText }}
                </div>
                <v-divider></v-divider>
                <m-tooltip bottom>
                  <template v-slot:element>
                    <div class="titleDiv">
                      <a style="color: grey" target="_blank" href="https://machinations.io/docs/math-js-functions">Find
                        more</a>
                    </div>
                  </template>
                  <template v-slot:message>
                    <div>{{ "Do you want to know more about this?" }}</div>
                  </template>
                </m-tooltip>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mathFunctionModel } from "../models/mathFunction.model";
import MTooltip from "@axten/m-tooltip";
import { TreeNode } from "./tree";

export default defineComponent({
  components: {
    MTooltip,
  },
  data() {
    return {
      message: "",
      searchText: "",
      showList: false,
      showDiv: false,
      divText: "text",
      showExampleDiv: false,
      exampleDivText: "",
      isDivExampleExtended: false,
      descriptionDivText: "",
      paramListSplitByOpenBracket: [] as string[],
      paramListSplitByClosedBracket: [] as string[],
      listOfParam: [] as string[],
      paramNr: 0,
      flagSearchIsFromClick: false,
      currentFunction: "",
      bracketFlag: false,
      tempTree: new TreeNode({ name: "" }, 0),
      functionToSearchFor: "",
      copyOfFunction: "",
    };
  },
  props: {
    listItems: {
      type: Array as () => mathFunctionModel[],
      default: () => [],
    },
  },
  computed: {
    filteredList(): mathFunctionModel[] {
      // Computed property to filter the listItems based on the current function from input text
      return this.listItems.filter((item: mathFunctionModel) =>
        item.name
          .toLowerCase()
          .startsWith(this.functionToSearchFor.toLowerCase())
      );
    },
    dataTree(): TreeNode {
      return TreeNode.parseTreeFromString(this.searchText)!;
    },
  },

  methods: {
    handleArrowKeyPressEvent(event: KeyboardEvent) {
      //handle each arrow press
      const key_code = {
        left: "ArrowLeft",
        up: "ArrowUp",
        right: "ArrowRight",
        down: "ArrowDown",
      };
      const key = event.code;
      if (Object.values(key_code).includes(key)) {
        const cursorPos = this.getCursorPosition();
        this.handleCursorChange(cursorPos);
      }
    },

    handleMouseUpEvent() {
      const cursPos = this.getCursorPosition();
      this.handleCursorChange(cursPos);
    },

    getCursorPosition() {
      //get the current cursor position in text field
      const input = this.$refs["myInput"] as any;
      const cursorPosition = input.$refs.input.selectionStart;
      return cursorPosition;
    },

    verifyIfDigit(textAfterSeparator: string) {
      const regex = /^\d+$/;
      return regex.test(textAfterSeparator);
    },

    extractFunctionAfterLastSeparator(
      inputString: string,
      cursorPosition: number
    ) {
      //used to extract the function where cursor is situated
      //returns the substring from the last sep / beginning of string to the cursorPosition
      const substringBeforeCursor = inputString.slice(0, cursorPosition);
      const lastOpenParenthesisIndex = substringBeforeCursor.lastIndexOf("(");
      const lastCommaIndex = substringBeforeCursor.lastIndexOf(",");

      //is the first function and nothing is written after it
      if (
        lastOpenParenthesisIndex === -1 &&
        lastCommaIndex === -1 &&
        !inputString.includes("(")
      ) {
        return inputString;
      }

      const lastSeparatorIndex = Math.max(
        lastOpenParenthesisIndex,
        lastCommaIndex
      );
      //return the string that is situated after the last separator in index input
      if (lastSeparatorIndex >= 0) {
        return inputString.slice(lastSeparatorIndex + 1, cursorPosition).trim();
      } else {
        //return the first function when the ( is open
        return inputString.slice(0, cursorPosition).trim();
      }
    },

    handleInputEvent() {
      const selectedItem = document.getElementById("mainInput");
      //check if some brackets are wrongly placed
      if (this.areBracketsOpen(this.searchText) === -1) {
        alert("wrong syntax!");
        selectedItem!.style.color = "red";
      } else {
        selectedItem!.style.color = "black";
      }

      const cursor = this.getCursorPosition();

      const extractedFunction = this.extractFunctionAfterLastSeparator(
        this.searchText,
        cursor
      );

      this.functionToSearchFor = extractedFunction;

      const cursorPosition = this.getCursorPosition();
      /// create new tree from this.searchtext
      this.tempTree = this.dataTree;

      this.handleCursorChange(cursorPosition);

      this.checkForDetailsDivShow();

    },

    checkForDetailsDivShow() {
      //checks if it's okay to display the Details div

      const lastOpenParenthesisIndex = this.searchText.lastIndexOf("(");
      const lastCommaIndex = this.searchText.lastIndexOf(",");

      const lastSeparatorIndex = Math.max(
        lastOpenParenthesisIndex,
        lastCommaIndex
      );

      if (lastSeparatorIndex !== -1) {
        const textAfterSeparator = this.searchText.slice(
          lastSeparatorIndex + 1
        );
        const selectedItem = this.listItems.find(
          (item) => item.name === textAfterSeparator.trim()
        );
        if (textAfterSeparator.slice(-1) !== "") {
          if (
            !selectedItem ||
            this.verifyIfDigit(textAfterSeparator.slice(-1)) == false
          ) {
          } else {
            this.showDiv = true;
          }
        }
      }

      this.copyOfFunction = this.functionToSearchFor;
    },

    handleCursorChange(cursorPos: number) {
      //handles a cursor change in all instances

      this.functionToSearchFor = this.extractFunctionAfterLastSeparator(
        this.searchText,
        cursorPos
      );

      //obtains the node that corresponds to the cursor position
      const treeNodeFromCursor = this.getTreeNodeFromIndex(cursorPos);


      if (treeNodeFromCursor) {
        //searches for parent node of treeNodeFromCursor
        const searchedNode = this.searchForNode(
          this.tempTree,
          treeNodeFromCursor,
          (parentTree: TreeNode, childTree: TreeNode) => {
            return parentTree.children.includes(childTree);
          }
        );

        //obtains parameters number for bolding purposes
        if (searchedNode) {
          if (searchedNode.children.length != 0) {
            for (let i = 0; i < searchedNode!.children.length; i++) {
              if (
                searchedNode.children[i].indexInInput ==
                treeNodeFromCursor.indexInInput
              )
                this.paramNr = i;
            }
          } else {
            this.paramNr = 0;
          }
        } else {
          this.paramNr = 0;
        }

        //if the treeNodeFromCursor is a node that has a parent that isn't a recognized function, don't display the details Div
        if (treeNodeFromCursor.data.name != "") {
          if (searchedNode) {
            if (
              !this.listItems.find(
                (item) => item.name === searchedNode.data.name.trim()
              )
            ) {
              this.showDiv = false;
              return;
            }
          }

          // Call the findDetails() function with appropriate arguments
          if (
            TreeNode.isNumeric(treeNodeFromCursor.data.name) &&
            !searchedNode
          ) {
            this.findDetails(treeNodeFromCursor.data.name);
          } else {
            this.findDetails(
              searchedNode
                ? searchedNode.data.name
                : treeNodeFromCursor.data.name
            );
          }
        }
      } else if (this.areBracketsOpen(this.searchText) === 0) { //if the cursor is at the end of the string, after the main function
        this.showDiv = false;
      }
    },

    boldingSyntaxForInputChange() {
      this.$nextTick(() => {
        // Reset the background color of all span elements to the default color "#c0ccff"
        for (let i = 0; i <= this.listOfParam.length; i++) {
          const divElement = document.getElementById("span-" + i);
          if (divElement) {
            divElement.style.backgroundColor = "#c0ccff";
            divElement.style.color = "black";
          }
        }

        // highlight the parameter that will be written in the function
        const currentDivElement = document.getElementById(
          "span-" + this.paramNr
        );
        if (currentDivElement) {
          currentDivElement.style.backgroundColor = "#627ddf";
          currentDivElement.style.color = "white";
        }
        const childNode = this.getTreeNodeFromIndex(this.getCursorPosition());
        const searchedNode = this.searchForNode(
          this.tempTree,
          childNode,
          (parentTree: TreeNode, childTree: TreeNode) => {
            return parentTree.children.includes(childTree);
          }
        );
        // when we have in syntax "..." there is an unlimited number of parameters, the parameter "..." will be displayed in bold
        const selectedItem = this.listItems.find(
          (item) => item.name === searchedNode?.data.name.trim()
        );
        if (selectedItem)
          if (selectedItem.syntax[0].includes("...")) {
            const params = selectedItem.syntax[0].split(",");
            if (params.length <= this.paramNr) {
              const currentDivElement = document.getElementById(
                "span-" + (params.length - 1)
              );
              currentDivElement!.style.backgroundColor = "#627ddf";
              currentDivElement!.style.color = "white";
            }
          } else {
            const params = selectedItem.syntax[0].split(",");
            if (params.length == this.paramNr) alert("too many parameters!");
          }

        this.isDivExampleExtended = false;
      });
    },

    findDetails(name: string) {
      //find syntax, description, examples and update bolding based on a given name
      const selectedItem = this.listItems.find(
        (item) => item.name === name.trim()
      );

      if (selectedItem) {
        this.descriptionDivText = selectedItem.description.toString();
        this.exampleDivText =
          selectedItem.examples[0] +
          (selectedItem.examples.length > 1
            ? " , " + selectedItem.examples[1]
            : "");
        this.divText = selectedItem.syntax[0].toString();
        this.showDiv = true;
        this.showExampleDiv = false;
        this.removeSpansFromDiv();
        this.getParametersForBolding();

        this.currentFunction = selectedItem.name;
        this.currentFunction += "(";
        this.boldingSyntaxForInputChange();
      } else { //in the case the name string doesn't represent a known function
        if (this.verifyIfDigit(name.slice(-1)))
          this.boldingSyntaxForInputChange();
      }
    },

    getTreeNodeFromIndex(index: number): TreeNode | null {
      const separators = "(),";
      let hadBrackets = false;
      let i = index;

      //treat some special cases



      if (i == this.searchText.length && this.searchText[i - 1] === "(") {
        i--;
      }

      //if cursor is on a separator
      if (separators.includes(this.searchText[i])) {
        i--;
      }

      let bracketCounter = 0;

      //bracketCounter is used to solve situation where cursor is after a closing bracket
      //the node that will be returned is the function that corresponds to that bracket
      for (; i > 0; i--) {
        if (this.searchText[i] == ")") {
          bracketCounter++;
        } else if (this.searchText[i] == "(" && bracketCounter > 0) {
          bracketCounter--;
          hadBrackets = true;
        } else if (
          separators.includes(this.searchText[i]) &&
          bracketCounter == 0
        ) {
          break;
        }
      }

      //if it's not the first char, increment in order to return the right position
      if (i !== 0) {
        i++;
      }

      // code for end of function, if we'd not like for it to show
      if (
        hadBrackets &&
        bracketCounter == 0 &&
        i == 0 &&
        index >= this.searchText.trimEnd().length
      ) {
        i = -1;
      }

      //searches for the node from the TreeNode that has the same index
      const searchedNode = this.searchForNode(
        this.tempTree,
        i,
        (tree: TreeNode, index: number) => {
          return tree.indexInInput === index;
        }
      );

      return searchedNode;
    },

    searchForNode(root: TreeNode | null, auxiliaryVar: any, searchCriteria: Function): TreeNode | null {
      //generic method that searches for a node for which the searchCriteria function returns true
      if (root) {
        if (searchCriteria(root, auxiliaryVar)) {
          return root;
        }
        for (const child of root.children) {
          let childNode = this.searchForNode(
            child,
            auxiliaryVar,
            searchCriteria
          );
          if (childNode) {
            return childNode;
          }
        }
      }
      return null;
    },


    getShortDescription(description: string | undefined): string {
      //gets a shortened description of the string description
      let descr: string = description as string;
      const maxLength = 150;
      if (descr.length > maxLength) {
        description = descr.slice(0, maxLength) + "...";
      }
      return description as string;
    },

    handleButtonClick() {
      // Method to handle button click event
      this.showList = true; // Show the list when the button is clicked
      this.isDivExampleExtended = false;
      this.showDiv = false;
    },

    handleClickItemList(mathFunctionItem: mathFunctionModel) {
      this.showList = true;
      const finalResult = mathFunctionItem.name.trim();
      const cursorPosition = this.getCursorPosition();
      const separators = "(),";
      let selectionEndSeparatorIndex = -1;
      let selectionBeginSeparatorIndex = -1;

      for (let i = cursorPosition; i < this.searchText.length; i++) {
        if (separators.includes(this.searchText[i])) {
          selectionEndSeparatorIndex = i;
          break;
        }
      } //if selectionEnd... stays on -1 then we need to consider the whole string from the left side
      for (let i = cursorPosition - 1; i >= 0; i--) {
        if (separators.includes(this.searchText[i])) {
          selectionBeginSeparatorIndex = i;
          break;
        }
      } //if selectionBegin... stays on -1 then we need to consider the whole string from the right side

      //beginSEPselectionSEPend

      let beginString = "";
      let endString = "";
      let newCursorIndex = 0;

      for (let i = 0; i < this.searchText.length; i++) {
        if (i === selectionBeginSeparatorIndex) {
          break;
        }
        beginString += this.searchText[i];
      }

      for (
        let i = selectionEndSeparatorIndex + 1;
        i < this.searchText.length;
        i++
      ) {
        endString += this.searchText[i];
      }

      if (selectionBeginSeparatorIndex === -1) {
        // selectionSEPend
        if (selectionEndSeparatorIndex === -1) {
          // selection
          this.searchText = finalResult;
        } else {
          // selectionSEPend
          this.searchText =
            finalResult +
            this.searchText[selectionEndSeparatorIndex] +
            endString;
          newCursorIndex = finalResult.length;
        }
      } else {
        // beginSEPselectionSEPend
        if (selectionEndSeparatorIndex === -1) {
          // beginSEPselection
          this.searchText =
            beginString +
            this.searchText[selectionBeginSeparatorIndex] +
            finalResult;
          newCursorIndex = this.searchText.length;
        } else {
          // beginSEPselectionSEPend
          this.searchText =
            beginString +
            this.searchText[selectionBeginSeparatorIndex] +
            finalResult +
            this.searchText[selectionEndSeparatorIndex] +
            endString;
            newCursorIndex = (beginString + this.searchText[selectionBeginSeparatorIndex] + finalResult).length;
        }
      }
      //with the input string modified, it's time to move onto the flags to show the details div

      this.bracketFlag = true;
      this.flagSearchIsFromClick = true;
      this.descriptionDivText = mathFunctionItem.description.toString();
      this.exampleDivText =
        mathFunctionItem.examples[0] +
        (mathFunctionItem.examples.length > 1
          ? " , " + mathFunctionItem.examples[1]
          : "");
      this.divText = mathFunctionItem.syntax[0].toString();
      this.showList = false;
      this.isDivExampleExtended = this.showExampleDiv = false;
      this.flagSearchIsFromClick = true;

      //an input change also occured, so we should call this
      this.handleInputEvent();


      //set the cursor position at the end of the newly added function
      const input = this.$refs["myInput"] as any;
      input.$refs.input.focus()
      this.$nextTick(() => input.$refs.input.setSelectionRange(newCursorIndex, newCursorIndex));
    },

    handleCloseList() {
      this.showList = false; // Hide the list
    },

    displayExampleAndDescription() {
      //handle the flags for each value the flagDivExample may take
      if (this.isDivExampleExtended) {
        this.showList = false;
        this.showDiv = true;
        this.showExampleDiv = false;
        this.isDivExampleExtended = false;
      } else {
        this.showList = false;
        this.showDiv = true;
        this.showExampleDiv = true;
        this.isDivExampleExtended = true;
      }
    },
    getParametersForBolding() {
      this.paramListSplitByOpenBracket = this.divText.split("(");
      this.$nextTick(() => {
        const divElement = document.getElementById("syntaxDiv");
        if (divElement) {
          // Create a new span element for the first part
          const newSpan = document.createElement("span");
          // Set the text content of the span element (replace "Your Text Here" with your desired content)
          newSpan.textContent = this.paramListSplitByOpenBracket[0] + "(";
          // Add any additional styles or attributes to the new span if needed
          newSpan.style.color = "black";
          // Append the new span to the syntaxDiv
          divElement.appendChild(newSpan);
          this.paramListSplitByClosedBracket =
            this.paramListSplitByOpenBracket[1].split(")");
          this.listOfParam = this.paramListSplitByClosedBracket[0].split(",");

          for (let i = 0; i < this.listOfParam.length; i = i + 1) {
            // Create a new span element for each part
            const span = document.createElement("span");
            span.setAttribute("id", "span-" + i);
            // Set the text content of the span element
            span.textContent = this.listOfParam[i];
            // Add any additional styles or attributes to the span if needed
            span.style.color = "black";
            // Append the span to the syntaxDiv
            divElement.appendChild(span);

            if (i < this.listOfParam.length - 1) {
              // Add a space after the parameter unless it's the last one
              const spaceSpan = document.createElement("span");
              spaceSpan.textContent = " ";
              divElement.appendChild(spaceSpan);

              const commaSpan = document.createElement("span");
              // Set the text content of the comma span element
              commaSpan.textContent = ",";
              // Add any additional styles or attributes to the comma span if needed
              commaSpan.style.color = "black";
              // Append the comma span to the syntaxDiv
              divElement.appendChild(commaSpan);

              // Add another space after the comma
              const spaceSpan2 = document.createElement("span");
              spaceSpan2.textContent = " ";
              divElement.appendChild(spaceSpan2);
            }
          }

          const closingParenthesisSpan = document.createElement("span");
          // Set the text content of the closing parenthesis span element
          closingParenthesisSpan.textContent = ")";
          // Add any additional styles or attributes to the closing parenthesis span if needed
          closingParenthesisSpan.style.color = "black";
          // Append the closing parenthesis span to the syntaxDiv
          divElement.appendChild(closingParenthesisSpan);
        }
      });
    },

    removeSpansFromDiv() {
      //remove existing spans from the syntax div
      this.$nextTick(() => {
        const divElement = document.getElementById("syntaxDiv");
        const spans = divElement?.querySelectorAll("span");
        if (spans) {
          spans.forEach((span) => {
            span.remove();
          });
        }
      });
    },

    areBracketsOpen(stringArray: string): number {
      //verify if brackets are open in the input text
      let counter = 0;
      for (let i = 0; i < stringArray.length; i++) {
        counter += stringArray[i] == "(" ? 1 : stringArray[i] == ")" ? -1 : 0;
        if (counter < 0) return -1;
      }
      return counter == 0 ? 0 : 1;
    },
  },
});
</script>

<style>
.v-card--link:before {
  background: none;
}

.input-container {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  /* Display the content in a column */
  align-items: center;
  /* Center items horizontally in the container */
  background-color: #f1f1f1;
  width: 450px;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}

.input-button-container {
  margin: 1 1;
  display: flex;
  align-items: center;
  flex: 1;
}

.red-input {
  color: black;
  font-weight: normal;
  border: none;
  border-radius: 10px;
  /* Make the input field rounded */
  background-color: #f1f1f1;
  padding: 10px;
  /* Adjust the padding for better alignment */
  margin: 20px;
  flex: 1;
  height: 2;
  size: 20px;
  width: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Add a subtle box-shadow */
  resize: none;
  /* Prevent the input field from being resizable */
  max-height: 7.5em;
  /* Limit the input field to a maximum of 5 lines (7.5em = 5 lines x 1.5em line-height) */
  overflow-y: auto;
  /* Enable vertical scrolling when content exceeds the maximum height */
}

.divForBrackets {
  background-color: #c0ccff;
  top: 100%;
  width: 398px;
  margin: 0 auto;
  padding: 20px;
  max-height: 300px;
  /* Set a maximum height if needed */
  position: absolute;
}

.example-div {
  display: flex;
  background-color: rgba(243, 238, 238, 0.669);
  color: black;
  margin-top: 10px;
  /* Add white-space property to preserve line breaks and wrap text */
  white-space: pre-wrap;
  font-size: 0.8rem;
  text-align: left;
  padding: 10px;
  box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.1);
  /* Change flex-direction to row-reverse */
}

.btnExample {
  /* Change flex-direction to row-reverse */
  margin-left: 200px;
  position: absolute;
  /* Set the top position to 50px */
  width: 100px;
  /* Set an appropriate width for the button */
  background: transparent;
}

.v-divider {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 347px;

  border-color: black;
  /* Set the color of the divider line */
}

.div-button-extend-example {
  width: 10px;
}

.main-container {
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
}

span.fixDiv {
  display: inline-block;
  width: 110px;
  font-size: 0.8rem;
  /*max-width: 100px;*/
  white-space: normal;
  overflow: hidden;
}

.container {
  display: flex;
  flex-direction: column;
}

.input-container,
.divForBrackets {
  flex: 1;
  min-height: 100px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.titleDiv {
  color: grey;
  font-size: 0.8rem;
}

a {
  color: grey;
}
</style>
