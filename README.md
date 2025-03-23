# Modern DevOps & IT Auditor Portfolio Website

A modern, visually appealing, and interactive personal portfolio website inspired by Brittany Chiang's portfolio style. This site is designed to showcase expertise as a DevOps Engineer and IT Auditor with a clean, responsive design.

![Portfolio Screenshot](https://via.placeholder.com/800x400?text=DevOps+Portfolio+Website)

## Features

- **Dark-themed** design with orange accent color (#FF9000)
- **Fully responsive** layout optimized for desktop, tablet, and mobile devices
- **Interactive elements** with smooth animations and transitions
- **Modern typography** with clear readability
- **Optimized performance** for fast loading times

## Sections

1. **Home** - Engaging introduction with name, role, and tagline
2. **About** - Professional bio highlighting core strengths and expertise
3. **Experience** - Professional timeline with job titles and companies
4. **Certifications** - Grid display of professional certifications
5. **Contact** - Contact form and social media links

## Technologies Used

- HTML5
- CSS3 (with CSS variables and flexbox/grid layouts)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript for customization

### Installation

1. Clone this repository or download the files
2. Customize the content in `index.html` to match your personal information
3. Modify the styles in `css/styles.css` if desired
4. Update the JavaScript functionality in `js/main.js` if needed

### Running Locally

Simply open the `index.html` file in your web browser to view the website locally.

For a more robust development environment, you can use a local server:

```bash
# Using Python
python -m http.server

# Using Node.js (requires http-server package)
npx http-server
```

## Customization

### Personal Information

Edit the `index.html` file to replace the placeholder information with your own:

- Name and title
- Professional bio
- Work experience
- Certifications
- Contact information and social media links

### Colors

To change the color scheme, modify the CSS variables in the `:root` selector in `css/styles.css`:

```css
:root {
    --primary: #FF9000; /* Change to your preferred accent color */
    --dark-bg: #0a192f; /* Main background color */
    /* Other color variables */
}
```

### Profile Picture

Replace the placeholder image with your own profile picture:

```html
<img src="assets/your-profile-picture.jpg" alt="Your Name">
```

## Deployment

This website can be deployed to any web hosting service that supports static websites, such as:

- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any standard web hosting provider

## License

This project is available for personal and commercial use.

## Acknowledgments

- Design inspired by Brittany Chiang's portfolio
- Font Awesome for the icons
- Google Fonts for the typography
