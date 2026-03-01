import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { emojiList } from './emojiList';

export type ComponentEmojiProps = {
  text: string;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
}

export class ComponentEmoji extends LitElement {
  @property({ type: String }) text = '';
  @property({ type: String, reflect: true }) size = 'm';

  static styles = css`
    :host {
      display: inline-block;
      line-height: 1;
    }
    :host([size="xs"]) { font-size: 0.8rem; }
    :host([size="s"]) { font-size: 1.2rem; }
    :host([size="m"]) { font-size: 2rem; }
    :host([size="l"]) { font-size: 3rem; }
    :host([size="xl"]) { font-size: 5rem; }

    .emoji {
        transition: transform 0.2s ease;
        cursor: default;
    }
    .emoji:hover {
        transform: scale(1.2);
    }
  `;

  private _getEmoji(): string {
    const normalizedText = this.text ? this.text.toLowerCase().trim() : '';

    if (!normalizedText) return '🫙';

    for (const item of emojiList) {
      if (item.keywords.some(keyword =>
        keyword.toLowerCase() === normalizedText ||
        normalizedText.includes(keyword.toLowerCase())
      )) {
        return item.emoji;
      }
    }
    return this._getRandomEmoji(normalizedText);
  }

  private _getRandomEmoji(input: string): string {
    let hash = 0;

    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
      hash |= 0;
    }

    const index = Math.abs(hash) % emojiList.length;
    return emojiList[index].emoji;
  }

  render() {
    return html`<span class="emoji" role="img" aria-label="${this.text}">${this._getEmoji()}</span>`;
  }
}
