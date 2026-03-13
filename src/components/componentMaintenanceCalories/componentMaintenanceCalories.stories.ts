import './index';
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/MaintenanceCalories',
  component: 'component-maintenance-calories',
  argTypes: {
    height: { control: 'number' },
    weight: { control: 'number' },
    gender: { control: 'radio', options: ['male', 'female'] },
    showWarning: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    height: 180,
    weight: 80,
    gender: 'male',
    showWarning: true,
    translations: JSON.stringify({
      height: 'Altura',
      weight: 'Peso',
      gender: 'Género',
      age: 'Edad',
      select: 'Seleccionar...',
      male: 'Hombre',
      female: 'Mujer',
      activityLevel: 'Nivel de Actividad',
      sedentary: 'Sedentario (poco o nada de ejercicio)',
      lightlyActive: 'Ligeramente activo (ejercicio ligero/deportes 1-3 días a la semana)',
      moderatelyActive: 'Moderadamente activo (ejercicio moderado/deportes 3-5 días a la semana)',
      veryActive: 'Muy activo (ejercicio duro/deportes 6-7 días a la semana)',
      extraActive: 'Extra activo (ejercicio muy duro y trabajo físico)',
      dailyCalories: 'Calorías de Mantenimiento',
      kcal: 'kcal',
      metabolicWarning: 'Consideraciones importantes: Esta estimación metabólica se basa en modelos estadísticos para la población general y no tiene en cuenta las variaciones individuales en la composición corporal (músculo vs. grasa). Estos cálculos deben utilizarse únicamente como una guía general. Para un enfoque nutricional preciso y seguro, recomendamos encarecidamente la supervisión médica o dietética profesional, ya que el control calórico sin guía puede estar asociado al desarrollo de patrones de conducta alimentaria de riesgo.',
      maintenanceCaloriesTitle: 'Tasa Metabólica Basal',
      mifflinStJeorSubtitle: 'Cálculo basado en el',
      methodLabel: 'método',
      save: 'Guardar'
    })
  },
  render: (args) => html`
    <component-maintenance-calories
      .height="${args.height}"
      .weight="${args.weight}"
      .gender="${args.gender}"
      .showWarning="${args.showWarning}"
      .translations="${args.translations}"
    ></component-maintenance-calories>
  `,
};

export const Female: Story = {
  args: {
    height: 165,
    weight: 60,
    gender: 'female',
    showWarning: true,
    translations: JSON.stringify({
      height: 'Altezza',
      weight: 'Peso',
      gender: 'Genere',
      age: 'Età',
      select: 'Seleziona...',
      male: 'Maschio',
      female: 'Femmina',
      activityLevel: 'Livello di Attività',
      sedentary: 'Sedentario (poco o niente esercizio)',
      lightlyActive: 'Leggermente attivo (esercizio leggero/sport 1-3 giorni a settimana)',
      moderatelyActive: 'Moderatamente attivo (esercizio moderato/sport 3-5 giorni a settimana)',
      veryActive: 'Molto attivo (esercizio pesante/sport 6-7 giorni a settimana)',
      extraActive: 'Extra attivo (esercizio molto pesante e lavoro fisico)',
      dailyCalories: 'Calorie di Mantenimento',
      kcal: 'kcal',
      metabolicWarning: 'Considerazioni importanti: Questa stima metabolica si basa su modelli statistici per la popolazione generale e non tiene conto delle variazioni individuali nella composizione corporea (muscolo vs. grasso). Questi calcoli devono essere utilizzati solo come guida generale. Per un approccio nutrizionale preciso e sicuro, raccomandiamo vivamente la supervisione medica o dietetica professionale, poiché l\'automonitoraggio calorico può essere associato allo sviluppo di disturbi del comportamento alimentare.',
      maintenanceCaloriesTitle: 'Tasso Metabolico Basale',
      mifflinStJeorSubtitle: 'Calcolo basato sul',
      methodLabel: 'metodo',
      save: 'Salva'
    })
  },
  render: (args) => html`
    <component-maintenance-calories
      .height="${args.height}"
      .weight="${args.weight}"
      .gender="${args.gender}"
      .showWarning="${args.showWarning}"
      .translations="${args.translations}"
    ></component-maintenance-calories>
  `,
};
