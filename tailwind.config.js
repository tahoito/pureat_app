import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                main:  "#5D8A66",   
                base:  "#F5EFE6",   
                text:  "#2F3E36",  
                accent:"#A8C686",   
                main2: "#88A47C", 
                accent2:"#304c00ff",
                heart:"#F4AFAF",
                }

        },
    },

    plugins: [forms],
};
