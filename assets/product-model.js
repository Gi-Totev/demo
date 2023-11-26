if (!customElements.get('product-model')) {
  class ProductModel extends DeferredMedia {
    constructor() {
      super();

      this.handlePauseRef = this.handlePause.bind(this);
    }

    handlePause() {
      this.modelViewerUI.pause();
    }

    loadContent() {
      super.loadContent();

      Shopify.loadFeatures([
        {
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: this.setupModelViewerUI.bind(this),
        },
      ]);
    }

    setupModelViewerUI(errors) {
      if (errors) return;

      this.modelViewerUI = new Shopify.ModelViewerUI(
        this.querySelector('model-viewer'),
      );
    }

    disconnectedCallback() {
      document.removeEventListener('product-model:pause', this.handlePauseRef);
    }

    connectedCallback() {
      document.addEventListener('product-model:pause', this.handlePauseRef);
    }
  }

  customElements.define('product-model', ProductModel);
}

/** @type {Object} ProductModel */
window['ProductModel'] = {
  loadShopifyXR() {
    Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: this.setupShopifyXR.bind(this),
      },
    ]);
  },

  /**
   * @param {*} [errors]
   */
  setupShopifyXR(errors) {
    if (errors) return;

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', () =>
        this.setupShopifyXR(),
      );
      return;
    }

    document.querySelectorAll('[id^="ProductJSON-"]').forEach((modelJSON) => {
      window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
      modelJSON.remove();
    });
    window.ShopifyXR.setupXRElements();
  },
};

window.addEventListener('DOMContentLoaded', () => {
  if (window.ProductModel) window.ProductModel.loadShopifyXR();
});
