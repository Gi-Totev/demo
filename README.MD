# Exo 2.0

**Important!**

Since this repo is with a standard Shopify files structure, but there are additional pre-commit hooks, that depend on npm, an `npm install` must be called right after cloning this repo.

Contents:

- [General](#general)
- [Developer tools](#developer-tools)
  - [Shopify CLI](#shopify-cli)
  - [Theme check](#theme-check)
  - [Prettier](#prettier)
- [Get started](#get-started)
  - [HTML Best practices](#html-best-practices)
  - [CSS Best Practices](#css-best-practices)
  - [Javscript Best Practics](#javscript-best-practics)
    - [Migrating from jQuery](#migrating-from-jquery)
    - [Add JS dependencies](#add-js-dependencies)
    - [Fetch Ajax Requests](#fetch-ajax-requests)
    - [Section Rendering API](#section-rendering-api)
  - [Accessibility](#accessibility)
    - [Forms](#forms)
  - [Performance](#performance)
    - [Lazyloaded images](#lazyloaded-images)
  - [Ignore Shopify files](#ignore-shopify-files)
- [Contributing](#contributing)
  - [Before contributing](#before-contributing)
  - [Contributing code](#contributing-code)
  - [Reporting a bug](#reporting-a-bug)
  - [Reviewing](#reviewing)
    - [Self review](#self-review)
    - [Suggested changes](#suggested-changes)

Exo 2.0 represents a HTML-first, JavaScript-only-as-needed approach to theme development. It's based on Dawn, which is Shopify's first source available theme with performance, flexibility, and [Online Store 2.0 features](https://www.shopify.com/partners/blog/shopify-online-store) built-in and acts as a reference for building Shopify themes.

## General

Exo 2.0:

- uses Shopify's [Dawn](https://dawn.shopify.com/) theme approach.
- uses semanthic HTML out-of-the-box
- follows HTML/CSS first approach
- styles/scripts are splitted in chunks and requested as needed, to ensure HTTP performance
- uses ES6+ for JS functionalities

## Developer tools

We encourage the using of VS Code, since this starter kit has several extensions, to offer.
There are a number of really useful tools that the Shopify Themes team uses during development. Exo 2.0 is already set up to work with these tools.

### Shopify CLI

[Shopify CLI](https://github.com/Shopify/shopify-cli) helps you build Shopify themes faster and is used to automate and enhance your local development workflow. It comes bundled with a suite of commands for developing Shopify themes — everything from working with themes on a Shopify store (e.g. creating, publishing, deleting themes) or launching a development server for local theme development.

You can follow this [quick start guide for theme developers](https://github.com/Shopify/shopify-cli#quick-start-guide-for-theme-developers) to get started.

### Theme check

We recommend using [Theme Check](https://github.com/shopify/theme-check) as a way to validate and lint your Shopify themes.

We've added Theme Check to Exo 2.0's [list of VS Code extensions](https://github.com/Shopify/dawn/blob/main/.vscode/extensions.json) so if you're using Visual Studio Code as your code editor of choice, you'll be prompted to install the [Theme Check VS Code](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode) extension upon opening VS Code after you've forked and cloned Exo 2.0.

You can also run it from a terminal with the following Shopify CLI command:

```bash
shopify theme check
```

### Prettier

This starter kit uses [Prettier](https://prettier.io/docs/en/index.html) as a pre-commit hook, in order to keep `css/js` code formatting consistent.
A message will appear to inform, that the `prettier` is formatting files, before commit.

## Get started

If this is your first project with Exo 2.0., take a deep look at the `assets\base.css` and `assets\global.js` files. You should only add logic there, not removing. Make sure you understand the contents.

Use [Shopify CLI](https://github.com/Shopify/shopify-cli) to connect to a store.

1. Use `shopify theme serve` for local development
2. Use `shopify theme pull` and select your development theme, to pull your settings, during local development (optionally)
3. Use `shopify theme push` and select a theme, where you want the changes to be visible

### HTML Best practices

- Always use semantic elements: `<nav>, <header>, <aside>, <address>`
- Try to keep in mind your heading structure - headings should always increase by 1 on a page (ie, you shouldn't have `<h1>`, `<h3>`, `<h4>`: semantically it might make more sense to use an `<h2>` and then style it using `.h3`)
- Use [`<details> / <summary>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) for collapsible elements (ex. FAQs), and style them with CSS. You shouldn't necessarily need JS, but if you do, in some cases you'll have to use `setTimeout()`, to apply classes for styles. Example:
  [How to Animate the Details Element](https://css-tricks.com/how-to-animate-the-details-element/)
- Reduce the number of elements, when possible. If you have a `<div>` as the sole child of its parent `<div>`, chances are, those two can be consolidated in to one
- The best way to load your site fonts is by including them in the head with the link tag and the prefetch/preload attribute. You can still include the CSS @font-face rule in your external stylesheet.
- Use `<strong>` instead of `<b>` and `<em>` instead of `<i>`
- Use web components when needed, and extend from them when possible (ex. a `<newsletter-modal>` might extend from a base `<modal>`), example: see below

### CSS Best Practices

- Colors:

  - The default colors can be found in the `settings_schema.json` file. They are set as css variables in the `settings.liquid` snippet.

- Name css files modular:
  - for a shopify section, prefix with `section-`, for example: `section-hero.css` for `sections\hero.liquid`
  - for a seperate component, prefix with `component-`, for example: `component-hero.css` for `<div class="hero"></div>`
- Avoid inline styles. When possible, even in JavaScript, styles should be updated by adding a class (`.hidden`) instead of setting the style (`...style.display = 'none'`)
- We use a mix of functional css classes and BEM selectors when we style a website. Functional classes can be thought of as helper classes. They allow us to easily bind a style declaration to a DOM node by just attaching a class. For example: `.hidden`, `.bold`, `.flex`, etc...
  BEM complements these functional classes by providing a robust framework to create context-specific classes. For example:

```css
.media {
  position: relative;
}

.media--square {
  padding-top: 100%;
}

.media--portrait {
  padding-top: 125%;
}

.media--landscape {
  padding-top: 66.6%;
}
```

- Use dash-cased variable names --type-variable-name (e.g. --color-red) over camelCased or snake_cased variable names.
- Use stateful classes. Stateful classes tell a developer that an element is in a current state, or that a script is acting upon the component. Stateful classes are not global, meaning they do not carry styles on their own. Scope stateful classes to an existing selector using "active" prefixes .is-, .has-, .was-, etc.

```css
.header {
  background-color: transparent;
}

.header.is-scrolled {
  background-color: var(--color-background-light);
}
```

- Request styles only if needed for a page. Example:
  - When the styles are mandatory: `{{- 'section-header.css' | asset_url | stylesheet_tag -}}`
  - When the styles aren't mandatory and can be loaded after the whole page load: `<link rel="stylesheet" href="{{ 'section-product-recommendations.css' | asset_url }}" media="print" onload="this.media='all'">`. You should add a noscript declaration, if the JS is disabled or unsupported:
  ```html
  <noscript>
    {{- 'section-product-recommendations.css' | asset_url |
    stylesheet_tag -}}
  </noscript>
  ```

### Javscript Best Practics

- JS should only be triggered inside an [Autonomous custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#autonomous_custom_elements). No need to embed the styles, using shadow root.
  Example:

```html
{{- 'section-header.css' | asset_url | stylesheet_tag -}}

<sticky-header class="header">
  <!-- Markup here -->
</sticky-header>
```

```js
class StickyHeader extends HTMLElement {
  constructor() {
    super(); // Always call super first in constructor,

    // write element functionality in here
  }
}

customElements.define('sticky-header', StickyHeader); // Define the custom DOM element
```

- Extend web components when possible. For example: `<newsletter-modal></newsletter-modal>` most likely acts as `<modal-dialog></modal-dialog>` with a few styles differences. Example:

```html
<modal-dialog> ... </modal-dialog>

<newsletter-modal> ... </newsletter-modal>
```

```js
class ModalDialog extends HTMLElement {
  constructor() {
    super();
    // Logic...
  }

  show() {
    // Logic...
  }

  hide() {
    // Logic
  }
}
customElements.define('modal-dialog', ModalDialog);

class NewsletterModal extends ModalDialog {
  constructor() {
    super();
    // Logic...
  }

  show(variable) {
    super.show(); // Call the parent class method
    console.log(variable); // Add logic to parent class method
  }
}
customElements.define('newsletter-modal', NewsletterModal);
```

Note, that the inheritance can happen in another file too, as long as the parent class is already defined.

- Reduce your dependency on external frameworks and libraries. If you need to use JavaScript, consider avoiding introducing third-party frameworks, libraries, and dependencies. Instead, use native browser features and modern DOM APIs whenever possible. Including JavaScript libraries in your package can lead to large bundle sizes, slow load times, and a poor experience for customers. Frameworks such as React, Angular, and Vue, and large utility libraries such as jQuery have significant performance costs.
- Use ES6/ES6+ syntax
- Request scripts only if needed for a page.
- Always defer scripts like so: `<script src="{{- 'script_name.js' | asset_url -}}" defer></script>`. More info [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-defer).

#### Migrating from jQuery

If you are not very comfort of using pure JS, below are a few common vanilla JS use cases, compared to jQuery:
[You might not need jQuery](https://youmightnotneedjquery.com/)

#### Add JS dependencies

If after all, you have to use JS libraries:

It is recommended to use Shopify CDN, instead of external CDN host.
If a script only belongs to a certain component that only appears on certain pages, include that script within that component file, instead of in `global.js` or the `<head>`.

Exo 2.0 uses [Swiper slider](https://swiperjs.com/) for utilizing slider elements.
You should only include its assets from the assets folder, only for parts of the page, where it is necessary.

#### Fetch Ajax Requests

We are using shopify's [ajax api](https://shopify.dev/api/ajax) using [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
For the `fetch` config, there is a helper function in `assets\global.js` - `fetchConfig`. You can modify it as needed.

#### Section Rendering API

You can use the [Section Rendering API](https://shopify.dev/api/section-rendering) to request the HTML markup for theme sections using an AJAX request. This can allow you to update page content without reloading the entire page by fetching and dynamically replacing only certain elements.
Plus, the need for additional non-layout template, ex: `product.upsell.liquid`, is avoided.

### Accessibility

Use this guide, if the project scope includes ARIA WCAG requirements:

https://shopify.dev/themes/best-practices/accessibility

Accessibility Dev Checklist

- [ ] Appropriate html tags are used
- [ ] Roles used when html tags are not available
- [ ] Hidden items are displayed correctly
  - [ ] Aria-hidden added
  - [ ] Aria-expanded added (if dropdown)
  - [ ] Aria-controls (as needed)
  - [ ] display: none used when item is out of view
- [ ] Focus
  - [ ] Items have focus state outline
  - [ ] Tabbable items that aren't default tabbable have tabindex="0" or greater than 0
  - [ ] Items that should not be tabbable have tabindex="-1"
- [ ] Forms
  - [ ] Inputs have labels that are properly linked
  - [ ] Aria-required and html 5 required are added to required inputs
  - [ ] Custom form inputs (not default html5) have:
    - [ ] aria-labeledby
    - [ ] aria-describedby
    - [ ] aria-required
    - [ ] aria-invalid
- [ ] Modals
  - [ ] Focus is trapped to opened modal

#### Forms

- Use Shopify forms when possible - they include their own accessible validation
- All inputs need `<label>`s, and the labels should not disappear on input
- Make sure that the screen reader moves to your success/error message appropriately, either by using .focus() or aria-live elements
- aria-required is being replaced by the HTML5 required attribute, but some documentation says to still include aria-required just in case required isn’t supported
- Use event.preventDefault() followed by a fetch/ajax request for custom validation/to stop any default submissions/to add third party integrations
- From Shopify’s accessibility best practices:
  - All form fields include a label. Fields can use aria-label, the .visuallyhidden element, floating labels, or a visible label to label forms. Form inputs and controls have names that clearly state their purpose.
  - Form inputs have labels with for attributes, including form labels in the theme settings.
  - Required inputs have the required attribute.
  - Fields use the autocomplete attribute. Auto-complete helps people fill in form fields by using the data stored in their browser.
  - Focus is placed on the feedback message. Any errors returned as a result of completing or submitting a form are communicated to screen readers where possible and as soon as possible.
  - Error messages are clear and descriptive.
  - The aria-describedby attribute is applied to input elements which reference the error text container.
  - Notifications, error messages, success messages are announced aloud. Critical information is announced by screen readers using aria-live.

### Performance

Please follow [Shopify's best practices](https://shopify.dev/themes/best-practices/performance) for performance.

#### Lazyloaded images

Exo 2.0 uses [lazysizes.js](https://github.com/aFarkas/lazysizes) to utilize lazyloaded images.
You should always use the `image.liquid` snippet, providing the desired behaviour. More info can be found in the snippet.
Additionally, you can use the `srcset.liquid` snippet, to provide additional image responsive sources. More info again in the snippet.
Also, take a look at the `aspect-ratio.liquid` snippet, when you want to use inline padding to keep the image original ratio.

### Ignore Shopify files

If you need to ignore certain Shopify files, then create `.shopifyignore` file in the project root and add the desired files. For example, if you want to ignore the json files:

```yml
config/settings_data.json
/templates/**/*.json
```

## Contributing

Whether you encounter bugs, have a suggestion or have a better idea for a certain approach, you are welcome to contribute.

### Before contributing

In any of the cases above, you must first create an issue in the `Issues` tab. Creating an issue before jumping into code ensures we can discuss it and determine whether it aligns with the direction of this starter kit.

### Contributing code

You can follow these steps to go from setting up a store to creating a pull request for Exo 2.0.

1. Set up a [development](https://shopify.dev/themes/tools/development-stores) store, so you can test your code changes (assuming you don't already have a store).
2. Install the Shopify CLI by following [these steps](https://shopify.dev/themes/tools/cli/installation).
3. Fork the repository, clone it and create a new branch.
4. Launch a development server:

```sh
shopify theme serve
```

5. Add your changes to the codebase.
6. Commit your changes:

```sh
git add <files>
git commit -m="Your very, very descriptive message"
```

7. Push your commit to your forked repository:

```sh
git push origin your-new-branch-name
```

8. Open a pull request.
9. We will review your changes and will decide our next move.

### Reporting a bug

Bugs are tracked as GitHub/GitLab issues. Search open issues to see, if someone else has reported a similar bug. If it's something new, open an issue. We'll use the issue to have a conversation about the problem you want to fix.

When creating a new issue, please ensure the issue is clear and include additional details to help maintainers reproduce it:

- Use a clear and descriptive title for the issue to identify the problem.
- Describe the exact steps which reproduce the problem in as many details as possible.
- Provide specific examples to demonstrate the steps. Include links to files, or copy/pasteable snippets. If you're providing snippets in the issue, use Markdown code blocks.
- Describe the behavior you observed after following the steps and point out what exactly is the problem with that behavior.
- Explain which behavior you expected to see instead and why.
- Include screenshots and animated GIFs where possible.

Always use pre-defined labels:

- `Done` - When the issue is reade for review
- `In progress` - When the issue is in work progress
- `Discussion` - When the issue needs further discussion
- `Archived` - when the issue is closed - either accepted or ignored
- etc...

### Reviewing

We (the Exo 2.0 maintainers) review every single PR. The purpose of reviews is to create the best version of Exo 2.0 we can.

#### Self review

You should always review your own PR first.

For code changes, make sure that you:

- Confirm that the changes meet our code principles from above.
- Check new or updated Liquid docs to confirm that the code used is up to date and isn't deprecated.
- If there are any failing checks in your PR, troubleshoot them until they're all passing.
- Always use shopify-theme-check before submitting your PR.

#### Suggested changes

We may ask for changes to be made before a PR can be merged, either using suggested changes or pull request comments. You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch.

As you update your PR and apply changes, mark each conversation as resolved.
