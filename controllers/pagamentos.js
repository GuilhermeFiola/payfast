module.exports = function(app){
    app.get("/pagamentos", function(req, res){
        console.log("Requisição recebida em /pagamentos");
        res.send("GET");
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
    });
}

