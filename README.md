# my-demo

## Getting started
The default scene is Condos.
Create an environment variable SCENE_ID={SCENEID} to set a different scene as the default.

Install dependencies
`npm install`

Install Novrender dependencies
`npm run dependencies`

Start dev server
`npm start`

Create production build
`npm run build`

## Directory structure
`src` - Contains all the files.

`src > components` - Contains components like canvas, search and Button

`src > hooks` - Contains the custom hooks

`build` - Contains the compress assets

`.env` - Contains URL and SceneID

## Few pointers
It seems like, copy plugin in webpack causing the initial issue when running project in dev mode. Unfortuanately, I do not have much time left to check and resolve. I hope, you understand. Here is a working demo video - https://app.screencast.com/Ng5IW1znIZ7RA
