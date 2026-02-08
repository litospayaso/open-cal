/**
 * Function to import a external url script
 * @param {string} url to import
 * @param {function} callback Function to call once the url is imported
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loadScript = (url: string, callback: any): void => {
  // adding the script element to the head as suggested before
  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;

  // then bind the event to the callback function
  // there are several events for cross browser compatibility
  // @ts-ignore
  script['onreadystatechange'] = callback;
  script.onload = callback;

  // fire the loading
  head.appendChild(script);
};

/**
 * Function to import css string into the page
 * @param styleString css string
 * @param id id of the style tag will be created (this prevent to create twice the same stylesheet)
 */
export const loadCss = (styleString: string, id: string): void => {
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
  }
};

/**
 * Function to register a web-component in the DOM
 * @param {string} tag tag name of the web-component
 * @param {CustomElementConstructor} component class of the web-component
 */
export const register = (tag: string, component: CustomElementConstructor) => {
  if (document.createElement(tag).constructor === HTMLElement) {
    const newComponent: any = component;
    const classVersion = () =>
      class Version extends newComponent {
        constructor() {
          super();
        }
      };
    window.customElements.define(tag, (classVersion() as unknown) as CustomElementConstructor);
  }
};
