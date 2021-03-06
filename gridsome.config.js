// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here requires a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
	siteName: "블로GU",
	siteDescription: "독서 등을 통한 자기 계발에 관심이 많은 주니어 웹프론트엔드 개발자",
	templates: {
		Tag: "/tag/:id",
	},
	plugins: [
		{
			// Create posts from markdown files
			use: "@gridsome/source-filesystem",
			options: {
				typeName: "Post",
				path: "content/posts/*.md",
				refs: {
					// Creates a GraphQL collection from 'tags' in front-matter and adds a reference.
					tags: {
						typeName: "Tag",
						create: true,
					},
				},
			},
		},
		{
			use: "gridsome-plugin-tailwindcss"
		},
	],

	transformers: {
		//Add markdown support to all file-system sources
		remark: {
			externalLinksTarget: "_blank",
			externalLinksRel: ["nofollow", "noopener", "noreferrer"],
			anchorClassName: "icon icon-link",
			plugins: ["@gridsome/remark-prismjs"],
		},
	},
};
