# Solace Senior Software Engineer Assignment - Implementation Task

## Project Overview

You're tasked with completing a NextJS application that displays a table of healthcare advocates. The codebase already has some improvements in progress through open pull requests, but there are several issues that need to be addressed. Your goal is to implement fixes and improvements to bring the application up to production quality.

## Current Status

The repository has three open PRs:
1. PR #2: Server-side search & pagination implementation
2. PR #7: UI accessibility improvements and component refactoring
3. PR #8: Documentation improvements

There are also several open issues related to code quality, security, and documentation that need to be addressed.

## Required Tasks

### 1. Security Improvements

- **Parameterize SQL Queries**: The specialty filtering implementation directly uses `JSON.stringify` in SQL queries, which presents a security risk. Implement proper parameterization using your SQL library's parameter binding mechanism (e.g., `sql.json()` or equivalent).
  - File to modify: API route handlers that execute SQL queries
    - Priority: High (security concern)

    ### 2. Code Quality Improvements

    - **Extract Common Filtering Logic**: There's duplicated filtering logic in both the main query and count query. Create a helper function (e.g., `applyFilters`) that takes a query, search string, and specialties array, and applies the necessary filters.
      - Files to modify: API route handlers
        - Example implementation pattern:
	  ```typescript
	    function applyFilters(query, search, specialties) {
	        // Apply search filters
		    // Apply specialty filters
		        return query;
			  }
			    ```

			    - **Fix TypeScript Issues**: Replace `any` return type in the database setup function with a specific database type.
			      - File to modify: `src/db/index.ts`
			        - Priority: Medium

				- **Add Missing Braces**: Ensure all conditional statements use braces for consistent code style and to prevent potential bugs.
				  - Priority: Low

				  ### 3. Performance Optimization

				  - **Abort Previous Fetch Requests**: When filters change, implement an abort controller to cancel any in-flight requests to prevent race conditions.
				    - File to modify: Custom hooks that fetch data
				      - Priority: Medium

				      ### 4. Documentation Fixes

				      - **Fix Broken Documentation Links**: Update links formatted as `[DISCUSSION.md](http://DISCUSSION.md)` to use relative paths like `[DISCUSSION.md](./DISCUSSION.md)`.
				        - Files to modify: All documentation files
					  - Priority: Low

					  - **Remove Extraneous Metadata**: Clean up metadata at the end of files.
					    - Files affected: Multiple documentation files
					      - Priority: Low

					      ### 5. Implementation Steps

					      1. First, review all open PRs to understand the current implementation strategy.
					      2. Focus on high-priority security fixes first.
					      3. Make code quality improvements next, focusing on extracting duplicate logic.
					      4. Implement performance optimizations.
					      5. Finally, fix documentation issues.

					      ## Technical Requirements

					      1. Maintain TypeScript type safety throughout the codebase.
					      2. Follow the existing code style and patterns.
					      3. Ensure all components are accessible.
					      4. Write clean, maintainable code with appropriate comments.
					      5. Organize API code to support both database and mock data sources.

					      ## Testing Guidelines

					      1. Verify that the search and filtering functionality works correctly.
					      2. Test pagination with various page sizes.
					      3. Ensure specialty filtering works as expected.
					      4. Verify that the UI is responsive across device sizes.
					      5. Check accessibility using keyboard navigation.

					      ## Deliverables

					      1. Fixed code addressing all the specified issues.
					      2. Updated documentation with correct links.
					      3. A completed DISCUSSION.md file outlining any additional improvements that could be made.

					      ## Additional Context

					      The application uses:
					      - NextJS for frontend and API routes
					      - Drizzle ORM for database access
					      - PostgreSQL as the database (with fallback to mock data)
					      - Tailwind CSS for styling
					      - React hooks for state management

					      Your implementation should maintain compatibility with these technologies while improving the overall quality and security of the application.
