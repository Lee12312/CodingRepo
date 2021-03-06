module.exports = {
    HTML:function(title,menu){
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <meta charset='utf-8'>
            ${this.CSS()}
        </head>
        <body>
            <div class="menu">
                ${menu}
            </div>
            <h1><a href="/">Home</a></h1>
            <div class="control">

            </div>
            <div class="container">

            </div>
        </body>
        </html>
        `
    },CSS:function(){
        return`
        <style>
            .menu{
                display: flex;
                flex-direction: row;
            }
            h1{
                margin-top: 50px;
            }
            ul{
                /* ul목록 앞에 붙은 *모양 없애줌 */
                list-style-type: none;
                position: fixed;
                margin: 0;
                padding: 0;
                background-color: #f1f1f1;
            }
            ul:after{
                content: '';
                display: block;
                clear: both;
            }
            li{
                float: left;
                margin: 10px;
            }
            li h1{
                /* a요소의 영역 block 라인으로 확장 */
                display: block;
                color: #000;
                padding: 8px 16px;
                text-decoration: none;
            }
            li h1{
                background-color: #4CAF50;
                color: white;
            }
            /* a:hover:not(.Home) - a요소가 Home 이 아닌경우 a요소에 마우스를 올리면
            색깔이 변하는 이벤트
            */
            li a:hover:not(h1){
                background-color: #555;
                color: white;
            }
        </style>
        `
    },menu:function(topics){
        list = '<ul>';
        for(let i = 0; i < topics.length; i++){
            list +=  `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
        }
        list += '</ul>';
        return list
    }
}