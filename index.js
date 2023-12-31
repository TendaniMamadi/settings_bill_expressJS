import express from 'express';
import {engine} from 'express-handlebars';
import bodyParser from 'body-parser';
import SettingsBill from './settings-bill.js';
import moment from "moment/moment.js";

const app = express();
const settingsBill = SettingsBill();


app.engine('handlebars', engine({
    layoutsDir: "./views/layouts"
}));
app.set('view engine', 'handlebars');
app.set('views', './views');


app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.render('index', {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals(),
        classNames: settingsBill.classNames()
    });
   // res.send('settings bill app') 
});

app.post('/settings', function (req, res) {
 
    settingsBill.setSettings({

        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });

    res.redirect('/');

});


app.post('/action', function (req, res) {
    //capture the action call or sms
    settingsBill.recordAction(req.body.actionType)
    
    res.redirect('/');
});

app.get('/actions', function (req, res) {
// let dataSet = settingsBill.actions()
    // for (let i = 0; i < dataSet.length; i++) {
    //     const element = dataSet[i];
    //     console.log(element);
    //     element.timestamp = moment().format('MMMM Do YYYY, h:mm:ss a'); 
    // }
    // console.log(settingsBill.actions());

    const realTime = settingsBill.actions().map(list => {

        return{
            type: list.type,
            cost: list.cost,
            timestamp: moment(list.timestamp).fromNow()
        }
    }) 


    res.render('actions',{actions: realTime});
  

});

app.get('/actions/:actionType', function (req, res) {

    const actionType =req.params.actionType;
    res.render('actions',{actions: settingsBill.actionsFor(actionType)});

});

const PORT = process.env.PORT || 3012;

app.listen(PORT, function (req, res) {
    console.log('App starting at port:', PORT);
});