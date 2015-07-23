var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes/new
exports.new=function(req,res){
	var quiz=models.Quiz.build( // crea objeto quiz
		{pregunta:"Pregunta", respuesta: "Respuesta"}
		);
		res.render('quizes/new',{quiz:quiz});


}

//POST /quizes/create
exports.create=function(req,res){
	var quiz=models.Quiz.build(req.body.quiz);
	// guarda en BD campo preg y resp de quiz
	quiz.save({fields:["pregunta","respuesta"]}).then(function(){
				res.redirect('/quizes');
				}) // redirección http a lista preg
				};
				
	

// GET /quizes
exports.index = function(req, res) {
 var theSearch='';
  if (!req.query.search)
    {  models.Quiz.findAll().then(
    function(quizes) {
      res.render('quizes/index', { quizes: quizes,theSearch:theSearch});
    }
  ).catch(function(error) { next(error);})
  }else {
theSearch=("%"+ req.query.search +"%").replace(/ /g, '%')
  
  models.Quiz.findAll({where: ["pregunta like ?", theSearch]}).then(
    function(quizes) {
      res.render('quizes/index', { quizes: quizes,theSearch:req.query.search});
    }
  ).catch(function(error) { next(error);})
		
	}
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};