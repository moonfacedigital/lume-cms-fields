import { Component } from "https://cdn.jsdelivr.net/gh/lumeland/cms@752b7a796a1d7fded4b2a38bad813d6efcf03a49/static/components/component.js"
import dom from "https://esm.sh/gh/oscarotero/dom@v0.1.0/dom.js"
import {
    oninvalid,
    updateField,
    view,
} from "https://esm.sh/gh/lumeland/cms@752b7a796a1d7fded4b2a38bad813d6efcf03a49/static/components/utils.js"

/**
 * @typedef {Object|string} Option
 * @property {string} [value] - The value of the option (if object)
 * @property {string} [label] - The display label of the option (if object)
 */

/**
 * @typedef {Object} ComboBoxAttributes
 * @property {number} [maxlength] - Maximum length of input
 * @property {number} [minlength] - Minimum length of input
 * @property {string} [pattern] - Validation pattern
 * @property {string} [title] - Title attribute for validation message
 * @property {*} [key] - Additional attributes
 */

/**
 * @typedef {Object} ComboBoxSchema
 * @property {string} name - Field name
 * @property {string} label - Field label
 * @property {string} [description] - Field description
 * @property {string} [value] - Initial value
 * @property {ComboBoxAttributes} [attributes] - Additional HTML attributes
 * @property {Option[]} options - Available options for the combobox
 */

/**
 * Combobox custom element that extends the base Component class
 * @extends Component
 */
export class ComboBox extends Component {
    /**
     * The input element
     * @type {HTMLInputElement}
     */
    input = null

    /**
     * The options list element
     * @type {HTMLUListElement}
     */
    optionsList = null

    /**
     * The dropdown button element
     * @type {HTMLButtonElement}
     */
    button = null

    /**
     * Track if we're interacting with options
     * @type {boolean}
     */
    interactingWithOptions = false

    /**
     * Initialize the combobox component
     */
    init() {
        // Inject styles
        const style = document.createElement("style")
        style.textContent = `
            .combobox-container {
                position: relative;
                display: block;
            }
            
            .combobox-input {
                padding-right: 2.5em;
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
            }
            
            .combobox-options[aria-hidden="false"] {
                display: flex;
            }
            
            .combobox-option {
                padding: 0.5em 0.75em;
                border-radius: var(--border-radius);
                cursor: pointer;
                color: var(--color-input-text);
            }
            
            .combobox-option:hover,
            .combobox-option[aria-selected="true"] {
                background-color: var(--color-highlight);
            }
        `
        this.appendChild(style)

        this.classList.add("field")

        // Show/hide options when clicking outside
        document.addEventListener("click", this.handleClickOutside.bind(this))

        /** @type {ComboBoxSchema} */
        const schema = this.schema
        /** @type {string} */
        const value = this.value
        /** @type {string} */
        const namePrefix = this.namePrefix
        /** @type {boolean} */
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

        // Create container for combobox elements
        const container = dom("div", { class: "combobox-container" }, this)

        // Create input element
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
            },
            container
        )

        // Create options list
        this.optionsList = dom(
            "ul",
            {
                class: "combobox-options",
                role: "listbox",
                "aria-hidden": "true",
            },
            container
        )

        // Populate options if they exist
        if (schema.options) {
            this.updateOptions(schema.options, value)
        }

        // Event listeners
        this.input.addEventListener("focus", () => {
            this.showOptions()
        })

        this.input.addEventListener("click", () => {
            this.showOptions()
        })

        this.button.addEventListener("mousedown", (e) => {
            e.preventDefault() // Prevent input blur
        })

        this.input.addEventListener("blur", () => {
            if (!this.interactingWithOptions) {
                setTimeout(() => this.hideOptions(), 200)
            }
        })

        this.optionsList.addEventListener("mousedown", () => {
            this.interactingWithOptions = true
        })

        this.optionsList.addEventListener("mouseup", () => {
            this.interactingWithOptions = false
        })

        this.input.addEventListener("keydown", (e) => this.handleKeyDown(e))
        this.input.addEventListener("input", () => this.filterOptions())

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

    /**
     * Update the options list
     * @param {Option[]} options - Array of options
     * @param {string} selectedValue - Currently selected value
     */
    updateOptions(options, selectedValue) {
        this.optionsList.innerHTML = ""

        options.forEach((option) => {
            // Handle both string and object options
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
                    onclick: () => {
                        this.selectOption({
                            value: optionValue,
                            label: optionLabel,
                        })
                        this.input.focus()
                    },
                    onmouseenter: () => {
                        this.interactingWithOptions = true
                    },
                    onmouseleave: () => {
                        this.interactingWithOptions = false
                    },
                    html: optionLabel,
                },
                this.optionsList
            )

            li.dataset.value = optionValue
        })
    }

    /**
     * Handle clicks outside the combobox
     * @param {MouseEvent} event - The click event
     */
    handleClickOutside(event) {
        if (!this.contains(event.target)) {
            this.hideOptions()
        }
    }

    /**
     * Clean up when element is disconnected
     */
    disconnectedCallback() {
        document.removeEventListener(
            "click",
            this.handleClickOutside.bind(this)
        )
    }

    /**
     * Toggle the options dropdown visibility
     */
    toggleOptions() {
        if (this.optionsList.getAttribute("aria-hidden") === "true") {
            this.showOptions()
        } else {
            this.hideOptions()
        }
    }

    /**
     * Show the options dropdown
     */
    showOptions() {
        this.optionsList.setAttribute("aria-hidden", "false")
        this.input.setAttribute("aria-expanded", "true")

        // Focus the first selected or first available option
        const selectedOption = this.optionsList.querySelector(
            '[aria-selected="true"]'
        )
        const firstOption = this.optionsList.querySelector(".combobox-option")

        if (selectedOption) {
            selectedOption.scrollIntoView({ block: "nearest" })
        } else if (firstOption) {
            firstOption.scrollIntoView({ block: "nearest" })
        }
    }

    /**
     * Hide the options dropdown
     */
    hideOptions() {
        this.optionsList.setAttribute("aria-hidden", "true")
        this.input.setAttribute("aria-expanded", "false")
    }

    /**
     * Select an option
     * @param {Option|{value: string, label: string}} option - The option to select (can be string or object)
     */
    selectOption(option) {
        // Normalize option to always have value and label properties
        const normalizedOption =
            typeof option === "string"
                ? { value: option, label: option }
                : option

        this.input.value = normalizedOption.label
        this.input.dataset.value = normalizedOption.value

        // Update aria-selected attributes
        this.optionsList.querySelectorAll('[role="option"]').forEach((opt) => {
            opt.setAttribute(
                "aria-selected",
                opt.dataset.value === normalizedOption.value ? "true" : "false"
            )
        })

        // Dispatch change event
        const event = new Event("change", { bubbles: true })
        this.input.dispatchEvent(event)

        this.hideOptions()
    }

    /**
     * Filter options based on input value
     */
    filterOptions() {
        const searchTerm = this.input.value.toLowerCase()
        const options = this.optionsList.querySelectorAll(".combobox-option")

        options.forEach((option) => {
            const text = option.textContent.toLowerCase()
            if (text.includes(searchTerm)) {
                option.style.display = "block"
            } else {
                option.style.display = "none"
            }
        })

        this.showOptions()
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - The keyboard event
     */
    handleKeyDown(e) {
        const options = Array.from(
            this.optionsList.querySelectorAll(
                '.combobox-option[style="display: block;"], .combobox-option:not([style])'
            )
        )
        const currentIndex = options.findIndex(
            (opt) => opt.getAttribute("aria-selected") === "true"
        )

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                this.showOptions()
                const nextIndex =
                    currentIndex < options.length - 1 ? currentIndex + 1 : 0
                options[nextIndex]?.scrollIntoView({ block: "nearest" })
                options[nextIndex]?.setAttribute("aria-selected", "true")
                if (currentIndex >= 0) {
                    options[currentIndex]?.setAttribute(
                        "aria-selected",
                        "false"
                    )
                }
                break
            case "ArrowUp":
                e.preventDefault()
                this.showOptions()
                const prevIndex =
                    currentIndex > 0 ? currentIndex - 1 : options.length - 1
                options[prevIndex]?.scrollIntoView({ block: "nearest" })
                options[prevIndex]?.setAttribute("aria-selected", "true")
                if (currentIndex >= 0) {
                    options[currentIndex]?.setAttribute(
                        "aria-selected",
                        "false"
                    )
                }
                break
            case "Enter":
                if (this.optionsList.getAttribute("aria-hidden") === "false") {
                    e.preventDefault()
                    const selected = this.optionsList.querySelector(
                        '[aria-selected="true"]'
                    )
                    if (selected) {
                        this.selectOption({
                            value: selected.dataset.value,
                            label: selected.textContent,
                        })
                    }
                }
                break
            case "Escape":
                this.hideOptions()
                this.input.focus()
                break
        }
    }

    /**
     * Get the current value of the combobox
     * @returns {string} The current value
     */
    get currentValue() {
        return this.input.dataset.value || this.input.value
    }

    /**
     * Update the combobox with new schema and value
     * @param {ComboBoxSchema} schema - The updated schema
     * @param {string} value - The new value
     */
    update(schema, value) {
        this.input.value = value ?? ""
        if (schema.options) {
            this.updateOptions(schema.options, value)
        }
        updateField(this, schema, this.input)
    }
}

// Define the custom element
customElements.define("f-combobox", ComboBox)
