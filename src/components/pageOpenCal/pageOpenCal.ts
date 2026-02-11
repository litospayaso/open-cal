import { html, css } from 'lit';
import Page from '../../shared/page';
import { variableStyles } from '../../shared/functions';
import '../pageUser/index';
import '../pageHome/index';
import PageHome from '../pageHome/pageHome';

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
    const style = document.createElement('style');
    style.textContent = variableStyles.cssText;
    document.head.appendChild(style);
  }

  render() {
    const params = this.getQueryParamsURL();
    const page = params.get('page');

    switch (page) {
      case 'search':
        return html`<page-search></page-search>`;
      case 'home':
        return html`<page-home></page-home>`;
      case 'food':
        return html`<page-food></page-food>`;
      case 'user':
        return html`<page-user></page-user>`;
      default:
        return html`<page-home></page-home>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-opencal': PageOpenCal;
  }
}
