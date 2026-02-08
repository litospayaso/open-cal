import { css, html } from 'lit'
import { state } from 'lit/decorators.js'
import Page from '../../shared/page';
import { getProduct } from '../../shared/httpEndpoints';
import { api } from '../../shared/api.decorator';

export interface FoodPageInterface {
}

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@api({getProduct})
export default class FoodPage extends Page<{ getProduct: typeof getProduct }> {
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
    this.data = (await this.api.getProduct('3274080005003'));
    console.log('%c this.data', 'background: #df03fc; color: #f8fc03', this.data);
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
    'food-page': FoodPage
  }
}
