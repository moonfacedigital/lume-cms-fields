import { Component } from "https://cdn.jsdelivr.net/gh/lumeland/cms@752b7a796a1d7fded4b2a38bad813d6efcf03a49/static/components/component.js"
import dom from "https://esm.sh/gh/oscarotero/dom@v0.1.0/dom.js"
import {
    oninvalid,
    updateField,
    view,
} from "https://esm.sh/gh/lumeland/cms@752b7a796a1d7fded4b2a38bad813d6efcf03a49/static/components/utils.js"

export class ComboBox extends Component {
    input = null

    optionsList = null

    originalOptions = []

    highlightedIndex = -1

    isFocusWithin = false

    init() {
        const style = document.createElement("style")
        style.textContent = `
            .combobox-container {
                position: relative;
                display: block;
            }
            
            .combobox-input {
                width: 100%;
            }
            
            .combobox-options {
                display: none;
                flex-direction: column;
                row-gap: 0.25em;
                position: absolute;
                width: 100%;
                max-height: 12em;
                overflow-y: auto;
                margin: 0.25em 0 0;
                padding: 0.25em 0.5em;
                list-style: none;
                background: var(--color-input-bg);
                border: 1px solid var(--color-line);
                border-radius: var(--border-radius);
                z-index: 100;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                top: 100%;
                left: 0;
            }
            
            .combobox-options[aria-hidden="false"] {
                display: flex;
            }
            
            .combobox-option {
                padding: 0.5em 0.75em;
                border-radius: var(--border-radius);
                cursor: pointer;
                color: var(--color-input-text);
                tab-index: -1; 
            }
            
            .combobox-option:hover,
            .combobox-option[aria-selected="true"] {
                background-color: var(--color-highlight);
            }
        `
        this.appendChild(style)

        this.classList.add("field")

        const schema = this.schema
        const value = this.value
        const namePrefix = this.namePrefix
        const isNew = this.isNew

        const name = `${namePrefix}.${schema.name}`
        const id = `field_${name}`

        view(this)
        dom("label", { for: id, html: schema.label }, this)

        if (schema.description) {
            dom(
                "div",
                { class: "field-description", html: schema.description },
                this
            )
        }

        const container = dom("div", { class: "combobox-container" }, this)

        this.input = dom(
            "input",
            {
                ...schema.attributes,
                id,
                name,
                oninvalid,
                value: isNew ? value ?? schema.value : value,
                class: "input combobox-input",
                "aria-autocomplete": "list",
                "aria-expanded": "false",
                "aria-haspopup": "listbox",
                role: "combobox",
                autocomplete: "off",
            },
            container
        )

        this.optionsList = dom(
            "ul",
            {
                class: "combobox-options",
                role: "listbox",
                "aria-hidden": "true",
                id: `${id}_listbox`,
            },
            container
        )

        this.input.setAttribute("aria-controls", this.optionsList.id)

        this.originalOptions = schema.options || []

        if (this.originalOptions.length > 0) {
            this.updateOptions(this.originalOptions, value)
        }

        // --- Start of change ---
        // Call filterOptions() on focus to prepare the dropdown list.
        // The filterOptions() method already handles showing/hiding the list.
        this.input.addEventListener("focus", () => {
            this.isFocusWithin = true
            this.filterOptions()
        })

        // Call filterOptions() on click to handle cases where the user
        // clicks a pre-populated input field.
        this.input.addEventListener("click", (e) => {
            if (this.optionsList.getAttribute("aria-hidden") === "true") {
                this.filterOptions()
            }
        })
        // --- End of change ---

        this.input.addEventListener("input", () => this.filterOptions())
        this.input.addEventListener("keydown", (e) => this.handleKeyDown(e))

        this.addEventListener("focusout", (event) => {
            if (!this.contains(event.relatedTarget)) {
                this.isFocusWithin = false
                this.hideOptions()
            }
        })

        this.addEventListener("focusin", () => {
            this.isFocusWithin = true
        })

        this.optionsList.addEventListener("mousedown", (e) => {
            e.preventDefault()
        })

        this.input.addEventListener("invalid", () => {
            this.input.dispatchEvent(
                new CustomEvent("cms:invalid", {
                    bubbles: true,
                    cancelable: false,
                    detail: { input: this.input },
                })
            )
        })
    }

    updateOptions(options, selectedValue) {
        this.optionsList.innerHTML = ""
        this.highlightedIndex = -1

        if (!options || options.length === 0) {
            this.hideOptions()
            return
        }

        options.forEach((option, index) => {
            const optionValue =
                typeof option === "string" ? option : option.value
            const optionLabel =
                typeof option === "string" ? option : option.label
            const isSelected = optionValue === selectedValue

            const li = dom(
                "li",
                {
                    class: "combobox-option",
                    role: "option",
                    "aria-selected": isSelected ? "true" : "false",
                    id: `${this.input.id}_option_${index}`,
                    onclick: () => {
                        this.selectOption({
                            value: optionValue,
                            label: optionLabel,
                        })
                        this.input.focus()
                    },
                    html: optionLabel,
                },
                this.optionsList
            )

            li.dataset.value = optionValue

            if (
                this.input.value &&
                optionLabel.toLowerCase() === this.input.value.toLowerCase()
            ) {
                this.highlightedIndex = index
            }
        })

        if (this.optionsList.getAttribute("aria-hidden") === "false") {
            this.showOptions()
        }
    }

    getVisibleOptions() {
        return Array.from(
            this.optionsList.querySelectorAll(
                '.combobox-option[style*="display: block"]:not([style*="display: none"])'
            )
        )
    }

    showOptions() {
        const visibleOptions = this.getVisibleOptions()

        if (visibleOptions.length === 0) {
            this.hideOptions()
            return
        }

        this.optionsList.setAttribute("aria-hidden", "false")
        this.input.setAttribute("aria-expanded", "true")

        this.optionsList.querySelectorAll('[role="option"]').forEach((opt) => {
            opt.setAttribute("aria-selected", "false")
        })

        let optionToHighlight = null
        if (
            this.highlightedIndex !== -1 &&
            visibleOptions[this.highlightedIndex]
        ) {
            optionToHighlight = visibleOptions[this.highlightedIndex]
        } else if (visibleOptions.length > 0) {
            optionToHighlight = visibleOptions[0]
            this.highlightedIndex = 0
        }

        if (optionToHighlight) {
            optionToHighlight.setAttribute("aria-selected", "true")
            this.input.setAttribute(
                "aria-activedescendant",
                optionToHighlight.id
            )
            optionToHighlight.scrollIntoView({ block: "nearest" })
        } else {
            this.input.removeAttribute("aria-activedescendant")
        }
    }

    hideOptions() {
        this.optionsList.setAttribute("aria-hidden", "true")
        this.input.setAttribute("aria-expanded", "false")
        this.input.removeAttribute("aria-activedescendant")

        this.optionsList.querySelectorAll('[role="option"]').forEach((opt) => {
            opt.setAttribute("aria-selected", "false")
        })
        this.highlightedIndex = -1
    }

    selectOption(option) {
        this.input.value = option.label
        this.input.dataset.value = option.value

        this.optionsList.querySelectorAll('[role="option"]').forEach((opt) => {
            opt.setAttribute(
                "aria-selected",
                opt.dataset.value === option.value ? "true" : "false"
            )
        })

        const event = new Event("change", { bubbles: true })
        this.input.dispatchEvent(event)

        this.hideOptions()
    }

    filterOptions() {
        const searchTerm = this.input.value.toLowerCase()
        const options = this.optionsList.querySelectorAll(".combobox-option")
        let hasVisibleOption = false

        this.highlightedIndex = -1
        this.input.removeAttribute("aria-activedescendant")
        this.optionsList.querySelectorAll('[role="option"]').forEach((opt) => {
            opt.setAttribute("aria-selected", "false")
        })

        Array.from(options).forEach((option) => {
            const text = option.textContent.toLowerCase()
            if (text.includes(searchTerm)) {
                option.style.display = "block"
                hasVisibleOption = true
            } else {
                option.style.display = "none"
            }
        })

        if (hasVisibleOption) {
            this.showOptions()
        } else {
            this.hideOptions()
        }
    }

    handleKeyDown(e) {
        const visibleOptions = this.getVisibleOptions()

        if (visibleOptions.length === 0 && e.key !== "Escape") {
            return
        }

        const currentActiveDescendantId = this.input.getAttribute(
            "aria-activedescendant"
        )
        let currentIndex = -1
        if (currentActiveDescendantId) {
            const currentActiveOption = document.getElementById(
                currentActiveDescendantId
            )
            if (currentActiveOption) {
                currentIndex = visibleOptions.indexOf(currentActiveOption)
            }
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                this.showOptions()

                let nextIndex =
                    currentIndex < visibleOptions.length - 1
                        ? currentIndex + 1
                        : 0

                if (visibleOptions[nextIndex]) {
                    if (currentIndex !== -1 && visibleOptions[currentIndex]) {
                        visibleOptions[currentIndex].setAttribute(
                            "aria-selected",
                            "false"
                        )
                    }
                    visibleOptions[nextIndex].setAttribute(
                        "aria-selected",
                        "true"
                    )
                    this.input.setAttribute(
                        "aria-activedescendant",
                        visibleOptions[nextIndex].id
                    )
                    visibleOptions[nextIndex].scrollIntoView({
                        block: "nearest",
                    })
                    this.highlightedIndex = nextIndex
                }
                break

            case "ArrowUp":
                e.preventDefault()
                this.showOptions()

                let prevIndex =
                    currentIndex > 0
                        ? currentIndex - 1
                        : visibleOptions.length - 1

                if (visibleOptions[prevIndex]) {
                    if (currentIndex !== -1 && visibleOptions[currentIndex]) {
                        visibleOptions[currentIndex].setAttribute(
                            "aria-selected",
                            "false"
                        )
                    }
                    visibleOptions[prevIndex].setAttribute(
                        "aria-selected",
                        "true"
                    )
                    this.input.setAttribute(
                        "aria-activedescendant",
                        visibleOptions[prevIndex].id
                    )
                    visibleOptions[prevIndex].scrollIntoView({
                        block: "nearest",
                    })
                    this.highlightedIndex = prevIndex
                }
                break

            case "Enter":
                if (this.optionsList.getAttribute("aria-hidden") === "false") {
                    e.preventDefault()
                    const selected = this.input.getAttribute(
                        "aria-activedescendant"
                    )
                        ? document.getElementById(
                              this.input.getAttribute("aria-activedescendant")
                          )
                        : null

                    if (
                        selected &&
                        selected.classList.contains("combobox-option")
                    ) {
                        this.selectOption({
                            value: selected.dataset.value,
                            label: selected.textContent,
                        })
                    } else {
                        const exactMatchOption = visibleOptions.find(
                            (opt) =>
                                opt.textContent.toLowerCase() ===
                                this.input.value.toLowerCase()
                        )
                        if (exactMatchOption) {
                            this.selectOption({
                                value: exactMatchOption.dataset.value,
                                label: exactMatchOption.textContent,
                            })
                        } else {
                            this.hideOptions()
                        }
                    }
                }
                break

            case "Escape":
                this.hideOptions()
                this.input.focus()
                break

            case "Tab":
                this.hideOptions()
                break
        }
    }

    get currentValue() {
        return this.input.dataset.value || this.input.value
    }

    update(schema, value) {
        this.input.value = value ?? ""
        this.originalOptions = schema.options || []
        this.updateOptions(this.originalOptions, value)
        updateField(this, schema, this.input)
    }
}

customElements.define("f-combobox", ComboBox)
