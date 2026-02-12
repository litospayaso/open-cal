import { html, css } from 'lit';
import Page from '../../shared/page';
import { state } from 'lit/decorators.js';
import { variableStyles } from '../../shared/functions';
import type { GroupButtonOption } from '../componentGroupButton/componentGroupButton';

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

  navigateToPage(params: { [key: string]: string }): void {
    delete (params.isTrusted);
    const currentParams = Object.fromEntries(this.getQueryParamsURL());
    if (params.page) {
      this.page = params.page || 'home';
    }
    this.setQueryParamsURL({ ...currentParams, ...params });
    this.requestUpdate();
  }

  onPageInit(): void {
    const style = document.createElement('style');
    style.textContent = variableStyles.cssText;
    this.applyTheme();
    document.head.appendChild(style);
  }

  pageRender() {
    const params = this.getQueryParamsURL();
    this.page = params.get('page') || 'home';
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
      default:
        return html`<page-home></page-home>`;
    }
  }

  handleGroupButtonClick(event: CustomEvent) {
    this.updateGroupButtonOptions();
    this.navigateToPage({ page: event.detail.id });
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
