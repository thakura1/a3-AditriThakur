## Todo Application
Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
Aditri Thakur 

https://todo-application-production-e8d9.up.railway.app/app

This web application is for managing personal todo list items. It allows users to log in via GitHub, create, update, and delete tasks, and tag deadlines with importance levels.

The main goal of this application is to provide a secure and easy-to-do todo list application with user-specific data.

Some challenegs I faced were implementing session-based authentication, ensuring todos are linked correctly to logged-in users, and handling asynchronous database operations. Implementing session-based authentication with GitHub OAuth required careful handling of express-session and passport to ensure users stayed logged in. I also had to link todos correctly to the logged-in user in MongoDB, which involved debugging null-user entries and ensuring all CRUD operations respected the authenticated session. Finally, handling asynchronous database operations and coordinating them with the frontend form submissions required careful use of async/await to ensure newly created todos appeared immediately for the correct user. Railway uses Docker and Docker was down for a bit which made it difficult for me to test my deployed code.

I used Bootstrap 5 as the main CSS framework. Bootstrap allowed me to quickly implement a professional design aesthetic. I also applied a custom color scheme and font family to match my design preference.I also styled buttons (btn-primary, btn-success, btn-danger) to fit the theme colors.

I used the following middleware in my application:
express.json(): Parses incoming JSON requests and makes the data available under req.body.
express.urlencoded({ extended: true }): Parses URL-encoded form data.
express.static(): Serves static files like HTML, CSS, and JS.
express-session: Manages server-side session storage for logged-in users.
connect-mongo: Stores session data in MongoDB so sessions persist across server restarts.
passport.initialize(): Initializes Passport authentication for the app.
passport.session(): Enables session-based authentication with Passport.
(checkAuth in routes): Verifies if the user is logged in before allowing access to todo routes and returns a 401 Unauthorized if not authenticated.

## Technical Achievements
- **Tech Achievement 1**: I used MongoDB Atlas, Mongoose, and connect-mongo to manage user-specific data and sessions securely and reliably.

## Technical Achievements
- **Tech Achievement 2**: I implemented OAuth authentication via GitHub, providing secure login without password management.

## Technical Achievements
- **Tech Achievement 3**: I deployed the application on Railway, demonstrating an alternative hosting solution to Render.

### Design/Evaluation Achievements
- **Design Achievement 1**: I used Bootstrap 5 for styling the website, only overriding some components with custom CSS to maintain a consistent color scheme and font style.

- **Design Achievement 2**: followed W3C Web Accessibility Initiative tips to make the site more accessible. I used semantic HTML elements such as <header>, <main>, <form>, <table>, and <button> to provide meaning and structure to the page. I also included proper <label> elements for all form inputs to improve screen reader support and usability for keyboard navigation.

- **Design Achievement 3**: I ensured sufficient color contrast between text and background for all interactive elements, such as buttons and table headers, following W3C color contrast recommendations. For example, the dark green login and submit buttons stand out clearly against the light background (#BFCF95 and #F9FAF5).

- **Design Achievement 4**: I used consistent and descriptive button text such as “Log in with GitHub,” “Submit,” “Edit,” “Save,” and “Delete” to help users understand the action that each button performs. This aligns with WAI tip #2, “Use clear and simple language,” enhancing readability and comprehension.

- **Design Achievement 5**: I provided placeholder text and proper input types for all form fields (e.g., type="text" for todo names, type="date" for deadlines), helping users enter correct information quickly while supporting mobile device optimizations.

- **Design Achievement 6**: I made the site fully keyboard-navigable, allowing users to tab through input fields, radio buttons, and action buttons without requiring a mouse, which improves accessibility for users with mobility impairments.

- **Design Achievement 7** I added hover and focus states for all buttons using Bootstrap classes and minimal custom CSS. This provides visual feedback to users interacting with buttons via mouse or keyboard.

- **Design Achievement 8** I used ARIA attributes where necessary, such as labeling the table (<table id="todoTable" aria-label="User Todos">) to ensure screen readers can describe the table content correctly.

- **Design Achievement 9** I avoided relying solely on color to convey meaning. For example, importance levels are shown as text (“low,” “medium,” “high”) in addition to being styled differently.

- **Design Achievement 10** I provided meaningful page titles and headings (<title> and <h1>) for each page to clearly communicate the page purpose, aiding screen reader users and search engine indexing.

- **Design Achievement 11** I ensured responsive design by using Bootstrap grid classes (col-lg-4, col-md-12) so the site looks correct on other devices, improving usability for all users.

- **Design Achievement 12**  I used consistent and logical layout and spacing, following W3C tips for visual clarity. Forms, tables, and buttons are grouped and spaced consistently, making the interface easier to scan and interact with.

- **Design Achievement 13**  On google lighthouse: For the login page, I recieved 100 in Performance, 100 is Accessibility, 96 in Best Practices, and 90 in SEO. For the main site, I recieved 100 in Performance, 95 is Accessibility, 96 in Best Practices, and 90 in SEO.

CRAP Principles

Contrast: The elements that receive the most visual emphasis on my site are the interactive buttons, including “Log in with GitHub,” “Submit,” “Edit,” and “Delete.” I applied a high contrast by using dark-colored buttons against lighter backgrounds, making them immediately noticeable. For example, the primary buttons/actions are displayed in a dark green color, while destructive actions such as deleting a todo are in red. This contrast not only helps users to identify actionable elements quickly, but it also establishes a clear visual hierarchy. I also made sure to use more muted colors (in comparison to fluorescent colors) to avoid eye strain. Table headers use a slightly darker shade than the data rows to differentiate them without being too jarring. Additionally, I ensured text readability by maintaining sufficient contrast between font colors and background areas, which improves accessibility for users with visual impairments. Overall, I used contrast strategically to draw attention to key actions, improving usability and user focus.

Repetition: I implemented repetition by consistently using similar design elements across all pages and components of the site. Buttons, borders, input fields, and table layouts share the same styles, such as consistent border-radius, padding, and font family, which creates a cohesive visual layout. The green and red color palette is repeated for action buttons throughout the site, reinforcing the meaning of interactive elements. Additionally, the typography is uniform across headings, labels, and table contents to ensure consistency and predictability. Repetition extends to layout patterns as well: Forms are structured in cards with rounded borders and shadow effects, tables follow consistent column arrangements, and radio buttons are always displayed in the same vertical order. This consistent design strengthens user familiarity and helps users intuitively navigate between different sections and pages.

Alignment: Alignment plays a key role in organizing content and improving readability on the site. Form labels and inputs are left-aligned, creating a clear visual flow that guides the eye naturally from top to bottom. In the todo table, each column is aligned to present information logically: Name, Deadline, Importance, Days Left, and Actions, thus allowing users to scan and compare entries efficiently. Buttons within forms and table rows are consistently positioned to maintain order and predictability. Even on smaller screens (smaller devices or minimized tabs), the Bootstrap grid system preserves alignment, preventing layout issues and maintaining an organized appearance. I also used alignment to enhance contrast: for instance, placing critical buttons consistently at the end of each row or form separates them from other information and visually signals their importance, supporting easy user interaction.

Proximity: Proximity is applied throughout the site to group related elements together, improving comprehension and usability. On the todo page, each todo item’s edit and delete buttons are placed immediately next to the corresponding data row, clearly indicating their relationship. Form fields are clustered together within a card, making it obvious which inputs belong to a single todo entry. On the login page, the heading, descriptive text, and login button are enclosed within a single visually unified card, reinforcing their connection. Spacing between form groups, table columns, and buttons is carefully controlled to avoid clutter while clearly delineating separate functional areas. By managing proximity thoughtfully, I reduced cognitive effort, prevented misclicks, and ensured that the visual grouping of related elements guides users naturally through each task, creating an intuitive and user-friendly interface.