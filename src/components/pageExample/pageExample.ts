import { css, html } from 'lit'
import { state } from 'lit/decorators.js'
import Page from '../../shared/page';
import { getData } from '../../shared/httpEndpoints';
import { api } from '../../shared/api.decorator';

export interface PageExampleInterface {
  bottomText?: string;
  count?: number;
}

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@api({getData})
export default class PageExample extends Page<{ getData: typeof getData }> {
  static styles = [
    Page.styles,
    css`
      div {
        font-family: arial;
        text-align: center;
      }
      span {
        background-color: yellow;
        font-weight: bold;
      }
    `,
  ]

  @state()
  data!: string;

  async onPageInit(): Promise<void> {
    this.data = (await this.api.getData()).data;
  }

  render() {
    return html`
      <div class="page-container">
        this is a page example
        <div>
          here is the result of the api: 
          <span>
            ${this.data ? this.data : 'NO DATA'}
          </span>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-example': PageExample
  }
}
