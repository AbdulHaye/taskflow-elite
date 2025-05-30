import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // Set MDI as the default icon set
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#6200EA',
          secondary: '#03DAC6',
          background: '#F5F5F5',
        },
      },
      dark: {
        colors: {
          primary: '#BB86FC',
          secondary: '#03DAC6',
          background: '#121212',
        },
      },
    },
  },
});