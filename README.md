[![Netlify Status](https://api.netlify.com/api/v1/badges/71eb6605-6c6e-41ca-b700-06b8bb08a39d/deploy-status)](https://app.netlify.com/sites/patyoon/deploys)

# Patrick Yoon's Website

I made this website with [Hugo](https://gohugo.io/) based on [hugo-tranquilpeak-theme](https://github.com/kakawait/hugo-tranquilpeak-theme) with the sidebar from [hugo-creative-portfolio-theme](https://themes.gohugo.io/hugo-creative-portfolio-theme/)

The site is deployed on [netlify](https://www.netlify.com/) with [Cloudinary](https://cloudinary.com/) as the image CDN. And it is connected with my notion with [notion-hugo](https://github.com/HEIGE-PCloud/Notion-Hugo) to use it as content management system (CMS).

### Local development

## Notion Hugo

Follow notion-hugo's [README](/notion_hugo_readme.md) to set up Notion as CMS.

## Theme

### Prerequisites

Install the theme's [dependencies](https://github.com/kakawait/hugo-tranquilpeak-theme/blob/master/docs/developer.md#installation). Install grunt

```
cd themes/hugo-tranquilpeak-theme
npm install grunt-cli -g
npm install
```

### Editing css files

Edit scss file under src/css in tranquilpeak, recompile theme files, and restart the server.

### Recompiling theme files

Changing theme files requires re-compiling assets and files

``` bash
npm run prod
```

### To release the theme change

``` bash
cd themes/hugo-tranquilpeak-theme
# Make sure to include the newly compiled static files.
git add . && git commit -m <msg>
git tag -a release-0.0.N
git push --tags
cd ../../
# update all submodules to latest tag
git submodule foreach 'git fetch origin; git checkout $(git describe --tags `git rev-list --tags --max-count=1`);'
# add submodule change.
git add . && git commit -m <msg>
git push
```

## Hugo

### Running server locally

``` bash
hugo server
```

## Commands

### Creating a new post

``` bash
hugo new content/post/<title>.md
```

### Adding an image

With the integration with Notion Hugo, instead of inserting image as

```
![](/uploads/unnamed-10.gif)
```

You must insert image as

```
{{< figure src="/uploads/unnamed.gif" >}}
```

Or to use the fancybox gallery style image use

```
{{< image classes="fancybox clear fig-75" src="/uploads/unnamed.gif" title="404" group="1">}}
```

Or a wide image that takes up the entire width

```
{{< wide-image
src="/uploads/img_7500-1-_fotor.jpg" title="I often thought Spain as a very dry country, but we passed along many rivers and creek during the entire walk" >}}
```

### Adding Youtube shorts

I added a shortcode optimized for rendering YouTube shorts.

```
{{< youtube_shorts "https://www.youtube.com/embed/LoBcUpz5MQE" >}}
```

### Setting frontmatters

Refer to the [user doc](https://github.com/kakawait/hugo-tranquilpeak-theme/blob/master/docs/user.md#writing-posts) for the frontmatters.

In addition to frontmatters from the theme, I added new frontmatters:

- `draft`: A post created as draft won't be generated.
- `private`: A post created as private will be generated but won't be indexed or show up on the list of posts. It can be only accessed via its URL.

### Subscription form

For subscription form I am using [beehiiv](https://www.beehiiv.com/) and the iframe submission form is embedded on the website.

## Deployment

### Netlify

Themes are registered as submodule ([resource](https://gohugo.io/hosting-and-deployment/hosting-on-netlify/#use-hugo-themes-with-netlify)).
Therefore, the theme repo must be set to public so that netlify builder can access it. In addition, the deploy key from netlify should be added to the submodule GitHub repo.

### Cloudinary CDN

The site is configured to use Cloudinary as the image CDN with lazy loading. Add images to `static/uploads` and they will be automatically uploaded to Cloudinary by the netlify builder. Reference images using `/uploads/filename.jpg`.

### Syncing with Notion

The continuous deploy runs every hour to sync content from Notion. You can also trigger it manually on netlify.

#### Dev Troubleshooting

- Error: Node Sass does not yet support your current environment: OS X 64-bit with Unsupported runtime (83)

Need to run

```
npm audit fix
```

- Website not showing css, js

Make sure to include compiled css/js files to the theme.
