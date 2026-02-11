import { html, css } from 'lit';
import Page from '../../shared/page';
import { palette } from '../../shared/functions';
import '../pageUser/index';

export default class PageOpenCal extends Page {
  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
      }
    `
  ];

  onPageInit(): void {
    Object.entries(palette).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }

  render() {
    const params = this.getQueryParamsURL();
    const page = params.get('page');

    switch (page) {
      case 'search':
        return html`<page-search></page-search>`;
      case 'food':
        return html`<page-food></page-food>`;
      case 'user':
        return html`<page-user></page-user>`;
      default:
        return html`<page-search></page-search>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-opencal': PageOpenCal;
  }
}
