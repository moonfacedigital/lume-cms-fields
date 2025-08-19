import { Component } from "https://cdn.jsdelivr.net/gh/lumeland/cms@3e98bdf869d7d526c241191031a0361ef894df73/static/components/component.js"
import dom from "https://esm.sh/gh/oscarotero/dom@v0.1.0/dom.js"
import {
    view,
    labelify,
} from "https://cdn.jsdelivr.net/gh/lumeland/cms@752b7a796a1d7fded4b2a38bad813d6efcf03a49/static/components/utils.js"

customElements.define(
    "f-library",
    class extends Component {
        init() {
            const style = document.createElement("style")
            style.textContent = `
    .component-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
    z-index: 1000;
    display: none;
    pointer-events: auto;
}

.modal-content {
    background: var(--color-input-bg);
    width: 90%;
    max-width: 1080px;
    height: 90vh;
    margin: 5vh auto;
    border-radius: var(--border-radius);
    display: flex;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border: 1px solid var(--color-line);
    pointer-events: none;
}

.modal-content > * {
    pointer-events: auto;
}

.modal-sidebar {
    width: 250px;
    flex-shrink: 0;
    background: var(--color-bg-secondary);
    border-right: 1px solid var(--color-line);
    overflow-y: auto;
    padding: 1em 0.75em;
}

.category-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.category-list li {
    padding: 0.75em 1.5em;
    cursor: pointer;
    color: var(--color-text);
    font-size: 0.9em;
    transition: background-color 0.2s;
    border-radius: var(--border-radius);
    font-weight: 600;

}

.category-list li:hover {
    background-color: var(--color-bg-hover);
}

.category-list li.active {
    background-color: var(--color-highlight);
}

.modal-main {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    min-width: 0;
}

.modal-header {
    padding: 1em 1.5em;
    border-bottom: 1px solid var(--color-line);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1em;
}

.modal-header-content {
    display: flex;
    align-items: center;
    gap: 1em;
    width: 100%;
}

.search-input {
    flex: 1;
    max-width: 400px;
    padding: 0.5em 1em;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-line);
    background: var(--color-input-bg);
    color: var(--color-text);
}

.components-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1em;
}

.components-container {
    padding: 1.5em;
    overflow-y: auto;
    flex: 1;
}

     .components-container > section:not(:first-child) {
        padding-top: 1em;
     }

     .components-container section:first-child > h2 {
       margin-top: 0 !important;
     }

.component-card {
    background: var(--color-input-bg);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-line);
    padding: 1.25em;
    cursor: pointer;
    transition: all 0.2s;
}

.component-card:hover {
    background-color: var(--color-highlight);
}

.component-card h3 {
    margin: 0 0 0.5em 0;
    color: var(--color-text);
    font-size: 1em;
    font-weight: 600;
}

.component-card p {
    color: var(--color-text-light);
    margin: 0 0 1em 0;
    font-size: 0.85em;
    line-height: 1.4;
}

.component-card img {
    width: 100%;
    border: 1px solid var(--color-line);
    border-radius: calc(var(--border-radius) - 2px);
    margin-top: 0.5em;
    object-fit: cover;
    aspect-ratio: 2 / 1;
}

.library-modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 1px solid var(--color-line);
    border-radius: var(--border-radius);
    color: var(--color-text);
    cursor: pointer;
    font-size: 1.5em;
    line-height: 1;
    aspect-ratio: 1 / 1;
    padding: 0.25em;
    height: 1.5em;
}

.library-modal-close:hover {
    background-color: var(--color-bg-hover);
}

.search-container {
    flex: 1;
    max-width: 400px;
    position: relative;
}

.search-input {
    width: 100%;
    padding: 0.5em 1em;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-line);
    background: var(--color-input-bg);
    color: var(--color-text);
}

.no-results-message {
    text-align: center;
    padding: 2rem 1rem;
    color: var(--color-text-light);
}
    
.no-scroll {
    overflow: hidden !important;
}

/* Responsive Styles for Mobile */
@media (max-width: 900px) {
    .modal-content {
        display: grid;
        width: 100%;
        height: 100%;
        margin: 0;
        border-radius: 0;
        border: none;
        grid-template-rows: auto auto 1fr;
        grid-template-columns: 1fr;
        grid-template-areas:
            "header"
            "sidebar"
            "content";
    }

    .modal-main {
        display: contents;
    }

    .modal-header {
        grid-area: header;
    }

    .components-container {
        grid-area: content;
        padding-top: 1em;
    }
    

    .modal-sidebar {
        grid-area: sidebar;
        width: 100%;
        height: auto;
        border-right: none;
        border-bottom: 1px solid var(--color-line);
        overflow-y: hidden;
        overflow-x: auto;
        padding: 0;
        background: var(--color-input-bg);
    }

    .modal-sidebar h3 {
        display: none;
    }

    .category-list {
        display: flex;
        padding: 0.5em 1.5em;
        gap: 0.5em;
    }

    .category-list li {
        padding: 0.5em 1em;
        white-space: nowrap;
        border-radius: var(--border-radius);
    }
}
            `
            this.appendChild(style)

            this.classList.add("field")
            const { schema, value, isNew } = this
            this.namePrefix = `${this.namePrefix}.${schema.name}`
            this.open = true
            this.index = 0

            view(this)
            dom(
                "label",
                {
                    for: `field_${this.namePrefix}.0`,
                    class: "field-label",
                    onclick: () => {
                        this.open = !this.open
                        this.querySelectorAll("details.accordion").forEach(
                            (el) => (el.open = this.open)
                        )
                    },
                    html: schema.label,
                },
                this
            )

            dom(
                "div",
                {
                    class: "field-description",
                    html: schema.description,
                },
                this
            )

            this.div = dom("div", { class: "fieldset" }, this)

            for (const v of (isNew ? value ?? schema.value : value) ?? []) {
                this.div.append(this.createOption(v))
            }

            const footer = dom(
                "footer",
                {
                    class: "field-footer ly-rowStack",
                },
                this
            )

            dom(
                "button",
                {
                    type: "button",
                    onclick: () => this.showComponentModal(),
                    class: "button is-secondary",
                    html: [
                        '<u-icon name="plus-circle"></u-icon>',
                        `Add ${labelify(schema.label)}`,
                    ],
                },
                footer
            )

            // Create modal with search input
            this.modal = dom(
                "div",
                {
                    class: "component-modal",
                    html: [
                        dom("div", {
                            class: "modal-content",
                            html: [
                                dom("div", {
                                    class: "modal-sidebar",
                                    html: dom("ul", { class: "category-list" }),
                                }),
                                dom("div", {
                                    class: "modal-main",
                                    html: [
                                        dom("div", {
                                            class: "modal-header",
                                            html: [
                                                dom("div", {
                                                    class: "search-container",
                                                    html: [
                                                        dom("input", {
                                                            type: "text",
                                                            class: "search-input",
                                                            placeholder: `Search ${schema.label}...`,
                                                        }),
                                                    ],
                                                }),
                                                dom("button", {
                                                    type: "button",
                                                    class: "library-modal-close",
                                                    html: '<svg data-testid="geist-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style="color: currentcolor;"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z" fill="currentColor"></path></svg>',
                                                    onclick: () =>
                                                        this.hideComponentModal(),
                                                }),
                                            ],
                                        }),
                                        dom("div", {
                                            class: "components-container",
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                },
                document.body
            )

            // Setup the search filter event listener
            this.setupSearchFilter()
        }

        createOption(value, isNew = false) {
            const field = this.schema.fields.find((f) => f.name === value.type)
            if (!field) {
                throw new Error(`Unknown field type: ${value.type}`)
            }

            const open = field.attributes?.open ?? isNew
            this.index++

            // Store reference to the current component instance
            const self = this

            const item = dom(field.tag, {
                "data-type": value.type,
                ".schema": {
                    ...field,
                    attributes: { ...field.attributes, open },
                    name: this.index,
                    label: field.label || field.name,
                    fields: [
                        {
                            name: "type",
                            tag: "f-hidden",
                            value: value.type,
                        },
                        ...field.fields,
                    ],
                },
                ".namePrefix": this.namePrefix,
                ".isNew": isNew,
                ".value": value,
                html: [
                    dom("button", {
                        type: "button",
                        class: "buttonIcon",
                        slot: "buttons",
                        html: '<u-icon name="trash"></u-icon>',
                        title: "Delete",
                        onclick() {
                            if (
                                confirm(
                                    "Are you sure you want to delete this item?"
                                )
                            ) {
                                this.parentElement.remove()
                            }
                        },
                    }),
                    dom("button", {
                        type: "button",
                        class: "buttonIcon",
                        slot: "buttons",
                        html: '<u-icon name="copy"></u-icon>',
                        title: "Duplicate",
                        onclick: function () {
                            item.after(
                                self.createOption(item.currentValue, true)
                            )
                        },
                    }),
                    dom("u-draggable", { slot: "buttons" }),
                ],
            })

            return item
        }

        showComponentModal() {
            this.modal.style.display = "block"
            this.populateModalContent()
            this.setupScrollSpy()

            // Reset search field and filter when opening modal
            const searchInput = this.modal.querySelector(".search-input")
            searchInput.value = ""
            this.filterComponents()

            // Focus search input when modal opens
            searchInput.focus()

            // Disable body scroll
            document.querySelector("html").classList.add("no-scroll")
        }

        hideComponentModal() {
            this.modal.style.display = "none"

            document.querySelector("html").classList.remove("no-scroll")
        }

        populateModalContent() {
            const { schema } = this
            const mainContent = this.modal.querySelector(
                ".components-container"
            )
            const sidebarList = this.modal.querySelector(".category-list")
            mainContent.innerHTML = ""
            sidebarList.innerHTML = ""

            const categories = {}
            schema.fields.forEach((component) => {
                const category = component?.category || "General"
                if (!categories[category]) {
                    categories[category] = []
                }
                categories[category].push(component)
            })

            Object.keys(categories).forEach((category, index) => {
                // Create sidebar item
                dom(
                    "li",
                    {
                        "data-category": category,
                        class: index === 0 ? "active" : "",
                        html: category,
                        onclick: () => {
                            const section = mainContent.querySelector(
                                `[data-category="${category}"]`
                            )
                            section.scrollIntoView({ behavior: "smooth" })
                        },
                    },
                    sidebarList
                )

                // Create component cards for this category
                const componentCards = categories[category].map((component) =>
                    dom("div", {
                        class: "component-card",
                        onclick: () => {
                            const div = this.querySelector(".fieldset")
                            div.append(
                                this.createOption(
                                    {
                                        type: component.name,
                                        ...Object.fromEntries(
                                            component.fields.map((f) => [
                                                f.name,
                                                f.value ?? "",
                                            ])
                                        ),
                                    },
                                    true
                                )
                            )
                            this.hideComponentModal()
                        },
                        html: [
                            dom("h3", {
                                html: component.label || component.name,
                            }),
                            component?.description
                                ? dom("p", { html: component.description })
                                : null,
                            component?.diagram
                                ? dom("img", {
                                      src: component.diagram,
                                      alt: `${component.label} diagram`,
                                  })
                                : null,
                        ],
                    })
                )

                // Create the main content section for this category
                dom(
                    "section",
                    {
                        "data-category": category,
                        html: [
                            dom("h2", { html: category }),
                            dom("div", {
                                class: "components-grid",
                                "data-category-content": category,
                                html: componentCards, // Add the cards here
                            }),
                        ],
                    },
                    mainContent
                )
            })
        }

        // Binds the filter function to the search input
        setupSearchFilter() {
            const searchInput = this.modal.querySelector(".search-input")
            searchInput.addEventListener("input", () => this.filterComponents())
        }

        // Filters components based on the search query
        filterComponents() {
            const query = this.modal
                .querySelector(".search-input")
                .value.toLowerCase()
                .trim()
            const mainContainer = this.modal.querySelector(
                ".components-container"
            )
            const sections = mainContainer.querySelectorAll("section")
            let hasVisibleComponents = false

            sections.forEach((section) => {
                const category = section.dataset.category
                const cards = section.querySelectorAll(".component-card")
                let hasVisibleCardsInSection = false

                cards.forEach((card) => {
                    const label = card
                        .querySelector("h3")
                        .textContent.toLowerCase()
                    if (label.includes(query)) {
                        card.style.display = "" // Use "" to reset to stylesheet's display property
                        hasVisibleCardsInSection = true
                        hasVisibleComponents = true
                    } else {
                        card.style.display = "none"
                    }
                })

                // Toggle visibility of the category section and its sidebar link
                const sidebarLink = this.modal.querySelector(
                    `.category-list li[data-category="${category}"]`
                )
                if (hasVisibleCardsInSection) {
                    section.style.display = ""
                    if (sidebarLink) sidebarLink.style.display = ""
                } else {
                    section.style.display = "none"
                    if (sidebarLink) sidebarLink.style.display = "none"
                }
            })

            // Handle "No results" message
            let noResultsEl = mainContainer.querySelector(".no-results-message")
            if (!hasVisibleComponents && query) {
                if (!noResultsEl) {
                    noResultsEl = dom("div", {
                        class: "no-results-message",
                        html:
                            `<h3>No ${this.schema.label} found</h3><p>Your search for "` +
                            query +
                            `" did not match any ${this.schema.label}.</p>`,
                    })
                    mainContainer.appendChild(noResultsEl)
                }
                noResultsEl.style.display = "block"
                noResultsEl.querySelector("p").innerHTML =
                    'Your search for "<b>' +
                    query +
                    `</b>" did not match any ${this.schema.label}.`
            } else if (noResultsEl) {
                noResultsEl.style.display = "none"
            }
        }

        setupScrollSpy() {
            const mainContentContainer = this.modal.querySelector(
                ".components-container"
            )
            const sidebarItems =
                this.modal.querySelectorAll(".category-list li")
            const sections = this.modal.querySelectorAll(
                ".components-container section"
            )

            if (this.modal.observer) {
                this.modal.observer.disconnect()
            }

            // This rootMargin creates a narrow horizontal line at the very top of the container.
            // An element is considered intersecting when its top edge crosses this line.
            // The -99% for the bottom margin ensures that the intersection zone is at the top.
            const options = {
                root: mainContentContainer,
                rootMargin: "0px 0px -99% 0px",
                threshold: 0,
            }

            const observer = new IntersectionObserver((entries) => {
                let activeCategory = null

                // Iterate through all entries to find the one whose top is at the top of the container
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        activeCategory =
                            entry.target.getAttribute("data-category")
                        break
                    }
                }

                // Fallback for when no section is currently intersecting (e.g., at the very bottom)
                if (!activeCategory) {
                    // Find the last section that has scrolled entirely past the top of the viewport
                    const lastPassedSection = Array.from(sections).findLast(
                        (section) => {
                            const rect = section.getBoundingClientRect()
                            return rect.top < 0
                        }
                    )
                    if (lastPassedSection) {
                        activeCategory =
                            lastPassedSection.getAttribute("data-category")
                    }
                }

                // Final fallback: if no other logic applies, activate the first section
                if (!activeCategory && sections.length > 0) {
                    activeCategory = sections[0].getAttribute("data-category")
                }

                // Update the active class on the sidebar items
                sidebarItems.forEach((item) => {
                    if (item.getAttribute("data-category") === activeCategory) {
                        item.classList.add("active")
                    } else {
                        item.classList.remove("active")
                    }
                })
            }, options)

            sections.forEach((section) => observer.observe(section))
            this.modal.observer = observer
        }

        get currentValue() {
            const values = []

            for (const el of this.querySelector(".fieldset").children) {
                values.push(el.currentValue)
            }

            return values
        }

        update(schema, values) {
            this.querySelector(".field-label").innerHTML = schema.label
            this.querySelector(".field-description").innerHTML =
                schema.description ?? ""
            const items = Array.from(this.querySelector(".fieldset").children)

            for (const value of values) {
                const field = schema.fields.find((f) => f.name === value.type)
                items.shift()?.update(
                    {
                        ...field,
                        fields: [
                            {
                                name: "type",
                                tag: "f-hidden",
                                value: value.type,
                            },
                            ...field.fields,
                        ],
                    },
                    value
                )
            }
        }
    }
)
