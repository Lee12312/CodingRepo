let db = require('./db.js');
let template = require('./template.js');
var url = require('url');
var qs = require('querystring');

exports.home = function(request,response){
    db.query(`select * from topic`, function(error,topics){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
    });
}

exports.page = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`select * from topic`, function(error,topics){
        //데이터 못가져올시 에러처리 -> 에러가 있다면 가져오는것을 중지
        if (error) throw error;
        //?는 뒤에값이 치환되어서 들어간다.
        //id=? 하고 queryData.id 를 하는 이유는 사용자의 공격에대해서 세탁해서 걸러준다.
        db.query(`select * from topic left join author on topic.author_id=author.id where topic.id=?`,[queryData.id], function(error2,topic){
          if (error2) throw error2;

          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>
            ${description}
            <p>by ${topic[0].name}</p>
            `,
            ` <a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>`
          );
          response.writeHead(200);
          response.end(html);
        });
    });
}

exports.create = function(request,response){
    db.query(`select * from topic`, function(error,topics){
        if (error) throw error;
        db.query(`select * from author`, function(error2,authors){
          if (error2) throw error2;

          var title = 'Create';
          var list = template.list(topics);
          var html = template.HTML(title, list,`
            <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              ${template.authorSelect(authors)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,`<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
        }); 
    });
}

exports.create_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
        insert into topic (title,description,created,author_id)
        values(?,?,now(),?)`,
        [post.title,post.description,post.author],
        function(error,result){

        if(error) throw error;
        //mysql에 데이터 생성했을 때 생성되는 id 값으로 바로 이동
        response.writeHead(302, {Location: `/?id=${result.insertId}`});
        response.end();
        });
    });
}

exports.update = function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`select * from topic`, function(error,topics){
        if (error) throw error;

        db.query(`select * from topic where id=?`,[queryData.id], function(error2,topic){
            if (error2) throw error2;

            db.query(`select * from author`, function(error3,authors){
                if (error3) throw error3;

                var title = topic[0].title;
                var description = topic[0].description;
                var list = template.list(topics);
                var html = template.HTML(title, list,`
                <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                    ${template.authorSelect(authors, topic[0].author_id)}
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

exports.update_process = function(request,response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
        UPDATE topic SET title=?,description=?,author_id=?
         WHERE id=?`,
        [post.title,post.description,post.author,post.id],
        function(error,result){

        if(error) throw error;
        response.writeHead(302, {Location: `/?id=${post.id}`});
        response.end();
        });

    });
}

exports.delete_process = function(request,response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
    var post = qs.parse(body);
    db.query(`DELETE FROM topic WHERE id=?`,[post.id],function(error,result){
            if (error) throw error;

            response.writeHead(302, {Location: `/`});
            response.end();
        });
    });
}