/* eslint-disable @typescript-eslint/unbound-method */
import { type CSSResultGroup, css, LitElement } from 'lit';

export default class Page<api = {}> extends LitElement {
  /**
   * It will be overrided with api decorator.
   */
  api!: api;

  constructor() {
    super();
  }

  static styles = [css`` as CSSResultGroup];

  /**
   * Function to navigate to another url.
   * If the string starts with / will concat string to the current url.
   * If it starts with http the whole location will be replaced.
   * Other case it will use the same origin to concat the url.
   * @param {string} url location to navigate
   */
  navigate(url: string): void {
    if (url.startsWith('/')) {
      window.location.href = window.location.href.concat(url);
    } else if (url.startsWith('http')) {
      window.location.href = url;
    } else {
      window.location.href = `${window.location.origin}/${url}`;
    }
  }

  /**
   * Function to open a url in a new tab.
   * @param {string} url to open in a new tab
   */
  openNewTab(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Function to get current url where the webcomponent is located
   * @returns window.location.href
   */
  getHref(): string {
    return window.location.href;
  }

  /**
   * Function to get hostname of current url
   * @returns window.location.hostname
   */
  getHostname(): string {
    return window.location.hostname;
  }

  /**
   * Function to get queryparams from current url
   * @returns url.searchParams: URLSearchParams
   */
  getQueryParamsURL(): URLSearchParams {
    const url: URL = new URL(this.getHref());
    return url.searchParams;
  }

  connectedCallback() {
    super.connectedCallback();
    this.onPageInit();
  }

  /**
   * It will be called after the Page component is loaded.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onPageInit(): void {}
}
