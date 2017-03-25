module.exports = function(app){
    app.get("/pagamentos", function(req, res){
        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.pagamentoDao(connection);
        
        pagamentoDao.lista(function(exception, result){
            if(exception){
                res.status(500).json(exception);
            }else{
                res.status(201).json(result);
            }
        });

        console.log("Requisição recebida em /pagamentos");
        connection.end();
    });

    app.get("/pagamentos/pagamento/:id", function(req, res){
        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.pagamentoDao(connection);

        var id = req.params.id;
        
        pagamentoDao.buscaPorId(id, function(exception, result){
            if(exception){
                res.status(500).json(exception);
            }else{
                res.status(201).json(result);
            }
        });

        console.log("Requisição recebida em /pagamentos/pagamento/" + id);
        connection.end();
    });

    app.post("/pagamentos/pagamento", function(req, res){
        var pagamento = req.body;
        
        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatória!").notEmpty();
        req.assert("valor", "Valor é obrigatório e deve ser um valor decimal!").notEmpty().isFloat();
        req.assert("moeda","Moeda é obrigatória e deve ter 3 caracteres!").notEmpty().len(3,3);

        var erros = req.validationErrors();

        if(erros){
            console.log("Erros de validação encontrados!");
            res.status(400).send(erros);
            return;
        }

        console.log("Processando pagamento...");

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.pagamentoDao(connection);

        pagamento.status = "CRIADO";
        pagamento.data = new Date;

        pagamentoDao.salva(pagamento, function(exception, result){
            console.log("Pagamento criado:" + result);
            res.location("/pagamentos/pagamento/" + result.insertId);
            
            pagamento.id = result.insertId;

            res.status(201).json(pagamento);
        });

        connection.end();
    });
}

