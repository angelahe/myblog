#myblog

#vim reminders
https://vim.rtorr.com/
move: eg 4 j go down 4 lines
h j k l
H M L
w e b
W E B
0 - start of line
^ - 1st non blank char
gg - 1st line of doc
G - last line
5G - line 5
{ } - jump to next/prev paragraph
move screens: down 1, up 1, up 1 screen, down 1 screen, 1/2 screen
Ctrl+e y b f d u

insert:
r - replace character
i - before cursor
I - at beginning of line
a - after cursor
A - end of line
o - append new line below current
O - apprend above current line

cut/paste:
yy - copy line (2yy for 2 lines)
y$ - copy to end of line
p - paste
dd - delete 1 line, 2dd
dw - delete word
D - delete to end of line
d$ cut to end of line
x - delete
> shift text right
< shift text left

#setup
mkdir myblog
cd myblog
npm init
npm install express@4.16.4 --save
npm install cors@2.8.5 --save
npm install body-parser@1.18.3 --save
npm install dotenv@6.2.0 --save
npm install nodemon@1.18.9 --save-dev
npm install @okta/oidc-middleware@1.0.2 express-session@1.15.6 --save

npm install @okta/oidc-middleware@1.0.2 express-session@1.15.6 --save

npm install sqlite3@4.0.4 sequelize@4.42.0 epilogue@0.7.1 --save

errors installing so try installing latest version?
+ epilogue@0.7.1
+ sequelize@5.21.5
+ sqlite3@4.1.1

Try `npm install @types/okta__oidc-middleware` if it exists or add a new declaration (.d.ts) file containing `declare module '@okta/oidc-middleware';`

#notes
express@4.16.4 - used to start the express web app
cors@2.8.5 - enable cross origin resource sharing
body-parser@1.18.3 - parse incoming request bodies
dotenv@6.2.0 - module to load .env file into process.env variables
nodemon@1.18.9 - helps auto restart the app when file is changed
@okta/oidc-middleware@1.0.2 express-session@1.15.6 - Okta authentication

Okta NodeJS OIDC Middleware for authentication. The back-end will use Express.js to power the server, Sequelize for storing and manipulating data, and Epilogue for automatically generating REST endpoints and controllers from the Sequelize data models.