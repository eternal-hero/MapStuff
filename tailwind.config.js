// CD (KO on 20210107): added tailwind.config.js, but didn't connect to React

const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.js',
    './components/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        cd: {
          primary: '#AA0000',
          secondary: '#',
        },
        mapstuff: {
          primary: '#3fc1c9',
          secondary: '#',
        },
        toggle: {
          primary: '#4F67ED',
        },
        sky: {
          '50': '#eef9f9',
          '100': '#d4f7f6',
          '200': '#a4f0eb',
          '300': '#67e5e1',
          '400': '#24d1d0',
          '500': '#3fc1c9',
          '600': '#0a989d',
          '700': '#0f7b7e',
          '800': '#125f60',
          '900': '#114d4d',
        },
        logo: {
          angularjs: '#E23237',
          bing: '#258FFA',
          blogger: '#FF5722',
          codeigniter: '#EF4223',
          django: '#092E20',
          'dot-net': '#5C2D91',
          drupal: '#0678BE',
          'ember-dot-js': '#E04E39',
          express: '#000000',
          ghost: '#738A94',
          googlemaps: '#4285F4',
          html5: '#E34F26',
          javascript: '#F7DF1E',
          joomla: '#5091CD',
          kakao: '#FFCD00',
          laravel: '#FF2D20',
          magento: '#EE672F',
          mapbox: '#000000',
          meteor: '#DE4F4F',
          'nuxt-dot-js': '#00C58E',
          openstreetmap: '#7EBC6F',
          python: '#3776AB',
          react: '#61DAFB',
          rubyonrails: '#CC0000',
          shopify: '#7AB55C',
          spring: '#6DB33F',
          squarespace: '#000000',
          'vue-dot-js': '#4FC08D',
          wix: '#0C6EFC',
          woocommerce: '#96588A',
          wordpress: '#21759B',
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
