import { html, css } from 'lit';
import Page from '../../shared/page';
import { state } from 'lit/decorators.js';
import { loadCss, variableStyles } from '../../shared/functions';
import type { GroupButtonOption } from '../componentGroupButton/componentGroupButton';
import '../pageMeal/pageMeal';

export default class PageOpenCal extends Page {
  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
      }
      .group-button-container {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        padding: 1rem;
        display: flex;
        justify-content: center;
      }
    `
  ];

  @state() page: string = 'home';
  @state() groupButtonOptions: GroupButtonOption[] = [
    { text: '🏠', id: 'home', active: true },
    { text: '🔍', id: 'search', active: false },
    { text: '👤', id: 'user', active: false },
  ];

  createRenderRoot() {
    return this;
  }



  navigateToPage(params: { [key: string]: string }, maintainParams: boolean = true): void {
    delete (params.isTrusted);
    const currentParams = Object.fromEntries(this.getQueryParamsURL());
    if (params.page) {
      this.page = params.page || 'home';
    }
    if (maintainParams) {
      params = { ...currentParams, ...params };
    }
    this.setQueryParamsURL(params);
    this.requestUpdate();
  }

  onPageInit(): void {
    const style = document.createElement('style');
    style.textContent = variableStyles.cssText;
    this.applyTheme();
    document.head.appendChild(style);

    PageOpenCal.styles.forEach((style, i) => {
      loadCss(String(style), `page-open-cal-styles-${i}`);
    });
  }

  pageRender() {
    const params = this.getQueryParamsURL();
    console.log('%c params', 'background: #df03fc; color: #f8fc03', params);
    this.page = params.get('page') || 'home';
    console.log('%c this.page', 'background: #df03fc; color: #f8fc03', this.page);
    this.updateGroupButtonOptions();

    switch (this.page) {
      case 'search':
        return html`<page-search 
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
        ></page-search>`;
      case 'home':
        return html`<page-home></page-home>`;
      case 'food':
        return html`<page-food 
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
        ></page-food>`;
      case 'user':
        return html`<page-user></page-user>`;
      case 'scanner':
        return html`<page-code-scanner 
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
        ></page-code-scanner>`;
      case 'meal':
        return html`<page-meal 
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
        ></page-meal>`;
      default:
        return html`<page-home></page-home>`;
    }
  }

  handleGroupButtonClick(event: CustomEvent) {
    this.updateGroupButtonOptions();
    this.navigateToPage({ page: event.detail.id }, false);
    this.requestUpdate();
  }

  updateGroupButtonOptions() {
    this.groupButtonOptions = this.groupButtonOptions.map(option => {
      option.active = option.id === this.page;
      return option;
    });
  }

  render() {
    return html`${this.pageRender()}
    <div class="group-button-container">
      <component-group-button 
        .options="${this.groupButtonOptions}" 
        @group-button-click="${this.handleGroupButtonClick}">
      </component-group-button>
    </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-opencal': PageOpenCal;
  }
}
