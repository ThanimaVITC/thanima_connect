# Thanima Recruitment Portal

This is a web application built for the Thanima cultural and literary club to streamline their recruitment process. It provides a user-friendly interface for applicants to submit their information and a secure admin dashboard for managing applications.

## Core Features

-   **Landing Page**: A welcoming home page that introduces the club, showcases its departments, and features a gallery of past events.
-   **Multi-Step Application Form**: An intuitive form at `/apply` that guides applicants through submitting their personal details, department preferences, and responses to essay questions.
-   **File Uploads**: Applicants can upload their resumes or other supporting documents, which are securely stored using MongoDB GridFS.
-   **Admin Dashboard**: A password-protected route at `/admin` for authorized users.
-   **Application Management**: Admins can view all submissions in a clean, tabular format.
-   **Data Export**: Functionality to export all application data to a CSV file for offline analysis.
-   **File Download**: A feature to download all uploaded resumes and supporting documents as a single zip archive.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Library**: [React](https://react.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) (with GridFS for file storage)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/)
-   **Schema Validation**: [Zod](https://zod.dev/)
-   **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
