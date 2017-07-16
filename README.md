# WebScraper JS - Client-side & Server-side – Demo
A proof of concept javascript application that extracts values (i.e. product name, specifications, session id) from a sample html file (i.e. index.html) and sends them to a back-end application. The express & node.js based back-end performs some processing (i.e. capitalisation) and returns the data along with the time of the order. That information is then posted into a grey container (i.e. “order processed”).


## Installation
1. Ensure that node and npm are already installed on your system (https://nodejs.org/en/download/package-manager/)
2. Clone or download the project to an appropriate local folder
3. Install dependencies by executing `npm install` in a terminal from the project directory root
4. Thereafter, run the server by executing `node index.js`
5. Now finally open up `index.html` in a browser
