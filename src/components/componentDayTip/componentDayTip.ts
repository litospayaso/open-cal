import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import Page from '../../shared/page';

type translationKey = 'es' | 'en' | 'it' | 'fr' | 'de';

export default class ComponentDayTip extends LitElement {
  @property({ type: String }) language: translationKey = 'en';

  @state() private tips: { [key in translationKey]: string[]; } = {
    es: [
      'Bebe más agua durante el día.',
      'Intenta comer al menos 5 porciones de frutas y verduras.',
      'Caminar 10,000 pasos al día mejora significativamente tu salud.',
      'Dormir entre 7 y 8 horas es fundamental para la recuperación muscular.',
      'Limita el consumo de bebidas azucaradas y opta por infusiones o agua.',
      'La constancia es la clave del éxito en cualquier plan nutricional.',
      'Planea tus comidas con antelación para evitar elecciones poco saludables.'
    ],
    en: [
      'Drink more water throughout the day.',
      'Try to eat at least 5 portions of fruits and vegetables.',
      'Walking 10,000 steps a day significantly improves your health.',
      'Sleeping between 7 and 8 hours is essential for muscle recovery.',
      'Limit sugary drinks and opt for infusions or water.',
      'Consistency is the key to success in any nutritional plan.',
      'Plan your meals in advance to avoid unhealthy choices.'
    ],
    it: [
      'Bevi più acqua durante il giorno.',
      'Cerca di mangiare almeno 5 porzioni di frutta e verdura.',
      'Camminare 10.000 passi al giorno migliora significativamente la tua salute.',
      'Dormire tra le 7 e le 8 ore è fondamentale per il recupero muscolare.',
      'Limita il consumo di bevande zuccherate e opta per infusi o acqua.',
      'La costanza è la chiave del successo in qualsiasi piano nutrizionale.',
      'Pianifica i tuoi pasti in anticipo per evitare scelte poco sane.'
    ],
    fr: [
      'Buvez plus d\'eau tout au long de la journée.',
      'Essayez de manger au moins 5 portions de fruits et légumes.',
      'Marcher 10 000 pas par jour améliore considérablement votre santé.',
      'Dormir entre 7 et 8 heures est essentiel pour la récupération musculaire.',
      'Limitez les boissons sucrées et optez pour des infusions ou de l\'eau.',
      'La régularité est la clé du succès de tout plan nutritionnel.',
      'Planifiez vos repas à l\'avance pour éviter les choix malsains.'
    ],
    de: [
      'Trinken Sie über den Tag verteilt mehr Wasser.',
      'Versuchen Sie, mindestens 5 Portionen Obst und Gemüse zu essen.',
      '10.000 Schritte am Tag zu gehen, verbessert Ihre Gesundheit erheblich.',
      '7 bis 8 Stunden Schlaf sind für die Muskelerholung unerlässlich.',
      'Begrenzen Sie zuckerhaltige Getränke und wählen Sie stattdessen Tees oder Wasser.',
      'Beständigkeit ist der Schlüssel zum Erfolg bei jedem Ernährungsplan.',
      'Planen Sie Ihre Mahlzeiten im Voraus, um ungesunde Entscheidungen zu vermeiden.'
    ]
  };

  @state() private selectedTip = '';

  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        margin: 16px 0;
      }
      .tip-card {
        background: var(--card-background);
        border: 2px dashed var(--card-border);
        border-radius: 8px;
        padding: 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-sizing: border-box;
      }
      .tip-title {
        font-weight: bold;
        color: var(--palette-purple);
        font-size: 0.9rem;
        text-transform: uppercase;
      }
      :host-context([data-theme="light"]) .tip-title {
        color: var(--palette-green);
      }
      .tip-text {
        font-size: 1rem;
        color: var(--card-text);
        line-height: 1.4;
      }
    `
  ];

  connectedCallback() {
    super.connectedCallback();
    this.selectRandomTip();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('language')) {
      this.selectRandomTip();
    }
  }

  private selectRandomTip() {
    const languageTips = this.tips[this.language] || this.tips.en;
    const randomIndex = Math.floor(Math.random() * languageTips.length);
    this.selectedTip = languageTips[randomIndex];
  }

  render() {
    const tipTitle = {
      es: 'Consejo del día',
      en: 'Tip of the day',
      it: 'Consiglio del giorno',
      fr: 'Conseil du jour',
      de: 'Tipp des Tages'
    }[this.language] || 'Tip of the day';

    return html`
      <div class="tip-card">
        <div class="tip-title">${tipTitle}</div>
        <div class="tip-text">${this.selectedTip}</div>
      </div>
    `;
  }
}
