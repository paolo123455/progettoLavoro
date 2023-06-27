
import { Component, OnInit } from '@angular/core';
import { InsPService } from 'src/services/ins-p.service';
import { AgGridAngular } from 'ag-grid-angular'
import {  ViewChild } from '@angular/core';
import {FormBuilder, FormArray,FormControl,FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { CellClickedEvent, CellEditingStartedEvent, CellValueChangedEvent, ColDef, GetRowIdFunc, GridReadyEvent } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-commesse-risorse',
  templateUrl: './commesse-risorse.component.html',
  styleUrls: ['./commesse-risorse.component.css']
})
export class CommesseRisorseComponent {
  constructor(
    private fb:FormBuilder,
    private http: HttpClient,
    private insP : InsPService
  ){ }

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  
  // istanzio le variabili utili alla gestione dei form comprese le select 
  form!: FormGroup; 
  form2!: FormGroup; 
  form3!: FormGroup; 
  myMap = new Map<string, string>();
  risorse: any[] = []
  risorse2: any[] = []
  commesse: any[] = []
  commesse2: any[] = []
  commesse3: any[] = []
  commesse4: any[] = []
  odls: any[] = []
  odl2: any[] = []
  odl3: any[] = []
 
  mesi : Number[] = [1,2,3,4,5,6,7,8,9,10,11,12]
  anni: Number[] = [2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050,2051,2052,2053,2054,2055]
  disabilitato = false;
  showForm = false;
  

  // Data that gets displayed in the grid
   
  public rowData$!: Observable<any[]>;
  private dati : any = null
  private datiV : any 
  private id_touch : String = ""
  private datvalid_livello : String = "" 
  private datvalid_ruolo : String = "" 
  commessar = new FormControl()
  risorsar = new FormControl()
  odlr = new FormControl()
  
  //istanzio la lista di colonne ag-grid inserendo la prima colonna (cestino)
	public columnDefs : ColDef[] = [{
		cellRenderer: (params : any) => {return '<div><button type="button" class="btn btn-sm"><i class="bi bi-trash-fill" style="color:red"></i></button></div>'},
		maxWidth: 34,
		filter: false,
		suppressMovable: true,
		lockPosition: 'left',
		cellClass: 'button-cell'
	}];
  
  //attributi di default di tutte le colonne ag-grid 
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };
  
  getRowId: GetRowIdFunc<any>  = params => params.data.id_attivita;

  ngOnInit(): void {
    
    
    
    //istanzio gli oggetti che controllano la logica dei form sull'interfaccia grafica
    this.form = this.fb.group({
      risorsa: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      commessa: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      odl: ''

    })
    this.form2 = this.fb.group({
      anno: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      mese :  new FormControl("",[ Validators.required,Validators.minLength(1)]),
      giornate:  '',
      budget  :  true,

    })
    this.form3 = this.fb.group({
     
      rendMens  : new  FormControl(),
      rendTot   : new  FormControl(),
      rendFitt : new  FormControl(),
      budMens : new  FormControl(),
      budTot  : new  FormControl()

    })

    // variabili per la gestione dei filtri 
    var anno : string = ""
    var mese : string = ""
    var budget : boolean = true
    var giornate : string = ""
    var codice : string = ""
    var descrizione : string = ""
    var nome : string = ""
    var cognome : string = ""
    var email : string = ""
    var odl: string = ""
    var id_odl : string = ""
    var descrizione_odl : string = ""
    


       
  // parte di codice necessaria per il search delle commesse nel filtro 
  this.commessar.valueChanges.subscribe(data => {
      console.log("var c")
    var appoggio  = this.commesse2.filter(( item: {
       descrizione2 : string
      }) =>   {
          
          return (item.descrizione2 +"").toLowerCase().includes((""+data).toLowerCase())
      })
  
   this.commesse =  [...new Map(appoggio.map((item: { [x: string]: any; }) =>
   [item["descrizione2"], item])).values()];
   

  })
  // parte di codice necessaria per il search delle risorse nel filtro 
  this.risorsar.valueChanges.subscribe(data => {
  
    var appoggio  = this.risorse2.filter(( item: {
       descrizione2 : string
      }) =>   {
        //  console.log(appoggio)
          return (item.descrizione2 +"").toLowerCase().includes((""+data).toLowerCase())
      })
  
   this.risorse = appoggio

  })

  // parte di codice necessaria per il search dell' odl nel filtro 
  this.odlr.valueChanges.subscribe(data => {
   
    var appoggio  = this.odl2.filter(( item: {
       descrizione2 : string
      }) =>   {

          
          return (item.descrizione2 +"").toLowerCase().includes((""+data).toLowerCase())
      })
   console.log("modifica")
   this.odls = appoggio

  })
    this.form2.valueChanges.subscribe((data)=>{
      this.disabilitato = this.form.valid && this.form2.valid
      console.log(this.form.valid)
    
      console.log(data)
       anno  =  data.anno === undefined || data.anno === null  ?"" :data.anno
       mese =  data.mese === undefined || data.mese === null ? "" :data.mese
    
     
  
   
     budget  =  data.budget === undefined || data.budget === '' || data.budget === null  ? false :data.budget
     budget = budget === undefined ? false : budget
      giornate =  data.giornate === undefined || data.giornate === null  ? "" :data.giornate
      giornate = giornate === undefined || giornate === null ? "" : giornate
     console.log(budget)
     console.log(this.dati)

     this.datiBudget(id_odl ,descrizione_odl,  odl , anno, mese  )

      var filteredData = this.dati.filter((item: {
        mese: string;
        flag_budget : string;
        giornate : string;
        anno: string;
        descrizione_progetto: any;
        descrizione_odl: any;
        codice: any;
        dtvalid_ruolo: any;
         ruoli: any;
        cognome: string;
        nome: string; id_risorsa: any;

        }) => 
        (item.anno+"").toLowerCase().includes((anno +"").toLowerCase())
        && (item.mese+"").toLowerCase().includes((mese+"").toLowerCase())
        && (item.flag_budget+"".toLowerCase()).includes((budget+"").toLowerCase())
        && (item.giornate+"").toLowerCase().includes((giornate+"").toLowerCase())
        &&item.nome.toLowerCase().includes(nome.toLowerCase())
        && item.cognome.toLowerCase().includes((cognome+"").toLowerCase())
        && item.codice.toLowerCase().includes((codice+"").toLowerCase())
        && (item.descrizione_odl+"").toLowerCase().includes((descrizione_odl+"").toLowerCase())
        && item.descrizione_progetto.toLowerCase().includes((descrizione+"").toLowerCase())

          );
      this.agGrid.api.setRowData(filteredData);
      this.resizeColumnWidth();
    })


    
    this.form.valueChanges.subscribe((data)=>{

    


    // controllo se i dati presenti permettono di attivare il pulsante 
    this.disabilitato = this.form.valid && this.form2.valid
    
    //prima pulizia dei dati presi dal form
    var datio: String =  data.odl === undefined || data.odl === null  ? undefined :data.odl.descrizione2
    var datic: String =  data.commessa === undefined || data.commessa === null  ? undefined :data.commessa.descrizione2
    var datir : String =  data.risorsa === undefined || data.risorsa === null ? undefined :data.risorsa.descrizione2
    
    // prendo i valori contenuti nel form per effettuare i filtri 
    descrizione_odl =  datio === undefined ? "" : datio.split(":")[0].split("--")[0]
    descrizione_odl = descrizione_odl === undefined ? "" : descrizione_odl
    odl =  datio === undefined ? "" : datio.split(":")[0].split("--")[1]
    odl = odl === undefined ? "" : odl
    id_odl = datio === undefined ? "" : datio.split(":")[1]
    id_odl = id_odl === undefined ? "" : id_odl
    codice =  datic === undefined ? "" : datic.split(":")[0].split("--")[1]
    codice = codice === undefined ? "" : codice
    descrizione =  datic === undefined ? "" : datic.split(":")[0].split("--")[0]
    descrizione = descrizione === undefined ? "" : descrizione
    console.log(codice ,"/", descrizione)
    nome = datir === undefined ? "" : datir.split(":")[0].split("-")[1]  === undefined ? "" : datir.split(":")[0].split("-")[1]
    nome = nome === undefined || nome === "undefined" || nome === null ? "" : nome
    cognome = datir === undefined ? "" : datir.split(":")[0].split("-")[0]  === undefined ? "" : datir.split(":")[0].split("-")[0]
    cognome = cognome === undefined || cognome === "undefined" || cognome === null ? "" : cognome
   // email = datir === undefined ? "" : datir.split(":")[0].split("-")[2]  === undefined ? "" : datir.split(":")[0].split("-")[2]
   // email = email === undefined || email === "undefined" || email === null ? "" : email
    
    // filtro per la select odl scelta la commessa 
    this.odl2 = this.odl3
    console.log(this.odl2)
    this.odl2 = this.odl2.filter(element => (element.descrizione3 +"").includes(codice+"") && (element.descrizione3 +"").includes(descrizione+""))
    console.log(this.odl2)
    this.odls = this.odl2

   // filtro incrociato per la select commessa scelto l'odl
   this.commesse2 = this.commesse3 
   console.log(this.commesse2 , odl, descrizione_odl)
   this.commesse2  = this.commesse2.filter(element =>  (element.descrizione3 +"").includes(odl ) && (element.descrizione3 +"").includes(descrizione_odl ))
   console.log(this.commesse2)
   console.log(this.commesse)
   //this.commesse4  = this.commesse2
   console.log(this.commesse)
   if (this.commesse2[0].descrizione2 === this.commesse[0].descrizione2)
   {

   }
   else 
   {
    this.commesse =  [...new Map(this.commesse2.map((item: { [x: string]: any; }) =>
    [item["descrizione2"], item])).values()];
    console.log(this.commesse)
   }
   
  /*
   if (odl != '' && odl != undefined && odl != null && this.form.get("commessa")?.value != null && this.form.get("commessa")?.value.descrizione2 +"" != this.commesse[0].descrizione2 ) 
   { 
     console.log(this.commesse[0].descrizione2 , "-",this.form.get("commessa")?.value)
     this.form.get("commessa")?.reset()
     console.log(this.commesse[0].descrizione2 , "-",this.form.get("commessa")?.value)
     
   }
   */

    
    // funzione che popola i campi presenti alla destra del form 
    this.datiBudget(id_odl ,descrizione_odl,  odl , anno, mese )

    //effettuo il filtro sui dati 
    var filteredData = this.dati.filter((item: {
      
      mese: String;
      flag_budget : String;
      giornate : String;
      anno: String;
      descrizione_odl : any;
      descrizione_progetto: any;
      codice: any;
      dtvalid_ruolo: any;
       ruoli: any;
      cognome: String;
      nome: String; id_risorsa: any; }) => 
      (item.anno+"").toLowerCase().includes((anno +"").toLowerCase())
      && (item.mese+"").toLowerCase().includes((mese+"").toLowerCase())
      && (item.flag_budget+"".toLowerCase()).includes((budget+"").toLowerCase())
      && (item.giornate+"").toLowerCase().includes((giornate+"").toLowerCase())
      &&item.nome.toLowerCase().includes(nome.toLowerCase())
      && item.cognome.toLowerCase().includes((cognome+"").toLowerCase())
      && item.codice.toLowerCase().includes((codice+"").toLowerCase())
      && (item.descrizione_odl+"").toLowerCase().includes((descrizione_odl+"").toLowerCase())
      && item.descrizione_progetto.toLowerCase().includes((descrizione+"").toLowerCase()))
 
    this.agGrid.api.setRowData(filteredData)
  })
  
    this.select()
    this.setup1()
    this.setup2()
    this.setup3()
    this.strucElaboration()

    
 

    
   
  }
  
  // parte di codice che ha il compito di calcolare i dati delle form non modificabili 
  // della scheramta (budget tot)
  datiBudget(id_odl : string ,descrizione_odl : string ,codice_odl : string , anno : string , mese : string  ){
    console.log(id_odl, descrizione_odl, anno , mese)
    if (mese === '' || mese === undefined || anno === '' || anno === undefined || id_odl === "" ||  id_odl === undefined) 
    {
       return 
    }
    else 
    {
      var query = "SELECT new_rilatt.get_budget_importo_totale('"+codice_odl+"')"
      console.log(query)
      this.insP.select(query).subscribe(Response => {
          var risposta = JSON.parse(JSON.stringify(Response))
          console.log(risposta)
          var budTot = risposta.rows[0].get_budget_importo_totale
          if ( budTot === null || budTot === 'null' )
          {
            this.form3.get("budTot")?.setValue("valore non trovato")
          }
          else 
          { 
            this.form3.get("budTot")?.setValue(budTot)
          }
        })
      query = "SELECT cost_model.get_budget_importo('"+codice_odl+"','"+anno+"','"+mese+"'); "
      console.log(query)
      this.insP.select(query).subscribe(Response => {
          var risposta = JSON.parse(JSON.stringify(Response))
          console.log(risposta)
          var budMes = risposta.rows[0].get_budget_importo
          if ( budMes === null || budMes === 'null' )
          {
            this.form3.get("budMens")?.setValue("valore non trovato")
          }
          else 
          { 
            this.form3.get("budMens")?.setValue(budMes)
          }
        })
       query = "SELECT new_rilatt.get_rendicontato_mensile('"+anno+"','"+mese+"' , '"+id_odl+"'); "
       console.log(query)
       this.insP.select(query).subscribe(Response => {
          var risposta = JSON.parse(JSON.stringify(Response))
          console.log(risposta)
          var rendMens = risposta.rows[0].get_rendicontato_mensile
          if ( rendMens === null || rendMens === 'null' )
          {
            this.form3.get("rendMens")?.setValue("valore non trovato")
          }
          else 
          { 
            this.form3.get("rendMens")?.setValue(rendMens)
          }
        })
       query = " SELECT new_rilatt.get_rendicontato_totale( '"+id_odl+"'); "
       console.log(query)
       this.insP.select(query).subscribe(Response => {
              var risposta = JSON.parse(JSON.stringify(Response))
              console.log(risposta)
              var rendTot = risposta.rows[0].get_rendicontato_totale
              if ( rendTot === null || rendTot === 'null' )
              {
                this.form3.get("rendTot")?.setValue("valore non trovato")
              }
              else 
              { 
                this.form3.get("rendTot")?.setValue(rendTot)
              }
            })
        query = "SELECT new_rilatt.get_rendicontato_mensile('"+anno+"','"+mese+"' , '"+id_odl+"', 'fittizio'); "
        console.log(query)
        this.insP.select(query).subscribe(Response => {
                   var risposta = JSON.parse(JSON.stringify(Response))
                   console.log(risposta)
                   var rendTot = risposta.rows[0].get_rendicontato_mensile
                   if ( rendTot === null || rendTot === 'null' )
                   {
                     this.form3.get("rendFitt")?.setValue("valore non trovato")
                   }
                   else 
                   { 
                     this.form3.get("rendFitt")?.setValue(rendTot)
                   }
                 })
    
    
    
  }
  }
  resizeColumnWidth(){
    // ridimensiona le colonne (larghezza) basandosi sul contenuto
    // il parametro della funzione è skipHeader (considera o meno la lunghezza dell'header)
    this.agGrid?.columnApi.autoSizeAllColumns(false);
  }

  onGridReady(params: GridReadyEvent) {
    this.agGrid.api.showNoRowsOverlay()
    //this.agGrid.getRowId   =  params =>{return params.data.id_risorsa}
    this.rowData$ = new Observable<any[]>
  }
 
  onCellClicked( e: CellClickedEvent): void {
    

    console.log('cellClicked', e);
    this.id_touch =  e.data.id_attivita

     
    console.log(this.id_touch) 
    var numeroC = e.column.getInstanceId()
    console.log(numeroC)
    var valore = e.column.getColId
    var left = e.column.getLeft()
    console.log(left)
    if (left === 0 && confirm('Eliminare definitivamente?'))
    {
      this.delete("delete from  new_rilatt.attivita_risorsa where id_attivita = " + this.id_touch)
    }
  }

  onCellEditingStarted( e: CellEditingStartedEvent): void { 
    var vecchioV = e.value; // save this value by attaching it to button or some variable
    console.log('cellEditingStarted');
    console.log(e);
    var colonna = e.colDef.field
    this.datiV = JSON.parse(JSON.stringify(e.node.data))
    console.log(this.datiV)
  }

  onCellValueChanged( e: CellValueChangedEvent): void {
  /*console.log(e);
    var datiC = e.data
    console.log(datiC)
    var colonna = e.colDef.field
    console.log(colonna)
    var valore = e.value
    var query = "update new_rilatt.progetti set " + colonna + " = '" + valore +"' where id_progetto = "+datiC.id_progetto
    console.log(valore)  
    console.log(query)
    this.update(query)*/
  }
 
  setup1= () => {
    var query = `select distinct   cognome || '-' || nome || '-' || ':' ||   id_risorsa as descrizione2 from new_rilatt.risorse order by descrizione2 `
    this.insP.select(query).subscribe(response =>{
      console.log(response) ;
      var dati = JSON.parse(JSON.stringify(response)).rows;
      this.risorse= dati; console.log(this.risorse)
      this.risorse2 = dati
     
    })

  }
  setup2= () => {
    var query = `select   c.descrizione || '--'  || c.codice || ':' || c.id   as descrizione2 , 
                 o.descrizione || '--'  || o.odl || ':' || o.id  as descrizione3 
                 from cost_model.commesse c 
                 left join  cost_model.cost_model o on c.id = o.id_commessa
                 order by descrizione2`
    this.insP.select(query).subscribe(response =>{
      console.log(response) ;
      var dati = JSON.parse(JSON.stringify(response)).rows;  
      this.commesse4 = dati
      this.commesse2 = dati
      this.commesse3 = dati 
      this.commesse =  [...new Map(dati.map((item: { [x: string]: any; }) =>
                        [item["descrizione2"], item])).values()];
      console.log(this.commesse, this.commesse2 )
    
    })
  }  
  setup3= () => {
    var query = `select   o.descrizione || '--'  ||o.odl || ':' || o.id  as descrizione2 ,
                 c.descrizione || '--'  ||c.codice || ':' || c.id  as descrizione3 
                 from cost_model.cost_model o
                 inner join cost_model.commesse c  on c.id = o.id_commessa
                 order by descrizione2 `
    this.insP.select(query).subscribe(response =>{console.log(response);
    var dati = JSON.parse(JSON.stringify(response)).rows;  
    this.odls = dati
    this.odl2 = dati
    this.odl3 = dati
    
    })
  }

  select  = ()  => {var query = "select * , o.odl as codice_odl,p.descrizione as descrizione_progetto , o.descrizione as descrizione_odl  from new_rilatt.attivita_risorsa ar inner join new_rilatt.risorse r on r.id_risorsa = ar.id_risorsa " +
                                "inner join cost_model.commesse  p on p.id = ar.id_progetto left join cost_model.cost_model o on ar.id_odl = o.id  "
      
 this.insP.select(query).subscribe(response =>{
     console.log(response) ;
     this.dati = JSON.parse(JSON.stringify(response)).rows; 
      this.agGrid.api.setRowData(this.dati)
  var  filteredData = this.dati.filter((item: {
    flag_budget: String;
      }) =>
    
     (item.flag_budget+ "").includes("false") 

  );
  this.agGrid.api.setRowData(filteredData)
  var appoggio = this.form.get("risorsa")?.value
  console.log(appoggio)
  this.form.get("risorsa")?.setValue(appoggio)//.setValue("", { onlySelf: true });
  this.form2.get("anno")?.setValue(this.form.get("anno")?.value)
  this.resizeColumnWidth();
 
  });

  

 
  }
 
  update = (query : String)   => this.insP.select(query).subscribe(response =>{
    console.log(response)
    var risposata = JSON.parse(JSON.stringify(response)) 
    if(risposata.upd === "ok")
    {
          console.log("update andato a buon fine")
    }
    else 
    { console.log("errore")
     console.log(this.datiV)
       
      this.agGrid.api.applyTransaction({update:[this.datiV]});
      Swal.fire({  
        icon: 'error',  
        title: 'ERRORE',  
        text: 'errore di update, codice : '+ risposata.code
        
      })  
      this.select()
    }
  
  })

  strucElaboration = () => this.insP.structUndestanding("select * from new_rilatt.setting_colonne sc where maschera  = 'attivita_risorsa'  order by importanza"  ).subscribe(response =>{
    console.log(response)
    console.log(response)
 
    var responsej = JSON.parse(JSON.stringify(response))
    for( let element of  responsej.rows) {
      console.log(element)
     this.columnDefs.push({
      "field" :  element.column_name,
      editable : element.editable,
      hide : !element.visible,
      resizable: true,
    })

    };

    
    //this.agGrid.api.setColumnDefs(this.columnDefs)
    this.agGrid.api.setColumnDefs(this.columnDefs);
    this.resizeColumnWidth();

  
  })

  delete =  (query : String)   => this.insP.select(query ).subscribe(response =>{
    console.log(response)
    var risposata = JSON.parse(JSON.stringify(response)) 
    if(risposata.upd === "ok")
    {
          console.log("delete  andato a buon fine "+ this.id_touch)
          this.agGrid.api.applyTransaction({remove:[{id_attivita : this.id_touch}]});
          this.select()
    }
    else 
    { console.log("errore")
    
       
      
      Swal.fire({  
        icon: 'error',  
        title: 'errore',  
        text: 'errore in delete, codice : ' + risposata.code
      
      })  
    }
  
  })

  inserisciRiga = () : void => {

    var insert1 =  JSON.parse(JSON.stringify(this.form.value))
    var insert2 =  JSON.parse(JSON.stringify(this.form2.value))
    console.log(insert1,insert2)
    var id_progetto = insert1.commessa.descrizione2 === undefined ? "" : insert1.commessa.descrizione2.split(":")[1]
    console.log(insert1.risorsa)
    var id_risorsa =  insert1.risorsa.descrizione2 === undefined ? "" :  insert1.risorsa.descrizione2.split(":")[1] 
    
    var id_odl = insert1.odl === undefined || insert1.odl.descrizione2 === undefined ? null : insert1.odl.descrizione2.split(":")[1]
    var giornate = insert2.giornate 
    giornate = giornate === undefined || giornate === null || giornate === '' ? "0" : giornate
    console.log(giornate)
    var flag_attivita  = false
    var flag_budget = insert2.budget === "" || insert2.budget === undefined ? false : insert2.budget
    var anno = insert2.anno
    var mese = insert2.mese
    var flag = false
    var flag2 = false
    var queryc = "SELECT new_rilatt.fnc_controllo_rendicontazione("+id_progetto+", "+id_risorsa+","+anno+","+mese+","+giornate+","+id_odl+","+ "'insert');"
    console.log(queryc)
    this.insP.select(queryc).subscribe(response =>{
      console.log(response)
      var risposta = JSON.parse(JSON.stringify(response)) 
      console.log(risposta.rows)
      var messaggio = risposta.rows[0].fnc_controllo_rendicontazione
      console.log(messaggio)
      var tipoMessaggio : String= messaggio.split("=")[0]
      console.log(tipoMessaggio)
      var msg =  messaggio.split("=")[1]
      console.log(msg)
      if(tipoMessaggio =="OK" )
      {    
        flag = true 

        }
        if(tipoMessaggio == "WR" )
        {    
          flag = true 
          flag2 = true
          
          
          console.log("WR")
         
  
          }
          if(tipoMessaggio  == "KO" )
             {    
                  flag = false
                  Swal.fire({  
                    icon: 'error',  
                    title: 'errore',  
                    text: msg + ", il record non verrà inserito",  
                      
                }) 
               } 
               if (!flag)
               {    
               }
               else {
               var query = "insert into new_rilatt.attivita_risorsa ( id_risorsa, id_progetto ,giornate  ,flag_attivita, flag_budget  , anno , mese , id_odl) values ('"+id_risorsa+"','"+id_progetto+"','"+giornate+"',"+flag_attivita+","+flag_budget+",'"+anno+"','"+mese+"',"+id_odl+" )  RETURNING id_progetto"
               console.log(query)
               this.insP.select(query).subscribe(response =>{
                 console.log(response)
                 var risposta = JSON.parse(JSON.stringify(response)) 
                 if(risposta.upd === "ok")
                 {   
                   console.log(flag2)
                  if(!flag2){
                             Swal.fire({  
                            icon: 'success',  
                            title: 'successo',  
                            text: 'inserimento commessa a risorsa  avvenuto con successo',  
                              
                             }) 
                        }
                       else
                       {
                        Swal.fire({  
                          icon: 'warning',  
                          title: 'warning',  
                          text: msg + ", il record è stato inserito ugualmente ",  
                            
                      }) 
                       } 
                        
                        
                       
                       //this.form.reset()
                     //  this.form2.reset()
                       
                      
                       this.select()
                      
                 }
                 else 
                 { console.log("errore")
                   console.log(risposta)
                  console.log(this.datiV)
                    
                 
                   Swal.fire({  
                     icon: 'error',  
                     title: 'errore',  
                     text: 'inserimento commessa a utente andata in errore, codice : ' + risposta.code,  
                
                   })  
                 }
               
               })
           
              }
  })
     

  }
}