import { Component, OnInit } from '@angular/core';
import { InsPService } from 'src/services/ins-p.service';
import { AgGridAngular } from 'ag-grid-angular'
import {  ViewChild } from '@angular/core';
import {FormBuilder, FormArray,FormControl,FormGroup, Validators } from '@angular/forms'
import { Observable, filter } from 'rxjs';
import { CellClickedEvent, CellEditingStartedEvent, CellValueChangedEvent, ColDef, Column, GetRowIdFunc, GridReadyEvent } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import Swal from 'sweetalert2';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@Component({
  selector: 'app-prospetto-mese',
  templateUrl: './prospetto-mese.component.html',
  styleUrls: ['./prospetto-mese.component.css']
})
export class ProspettoMeseComponent {
  constructor(private fb:FormBuilder, private http: HttpClient, private insP : InsPService){ }
  form!: FormGroup; 
  form2!: FormGroup; 

  myMap = new Map<string, string>();
  public bankMultiFilterCtrl: FormControl = new FormControl();
  commesse: any[] = []
  commesse2: any[] = []
  mappaMeseNUmero : any  = {
    "gennaio" : 1, 
    "febbraio" : 2,
    "marzo" : 3,
    "aprile" : 4, 
    "maggio" : 5,
    "giugno " : 6,
    "luglio" : 7, 
    "agosto" : 8,
    "settembre" : 9,
    "ottobre" : 10, 
    "novembre" : 11,
    "dicembre" : 12
  }
  anni : number[] =[2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050,2051,2052,2053,2054,2055]
  anni2 :  number[] = this.anni
  mesi : any[] = []
  odls : any[] = []
  odls2 : any[] = []
  annoc = new FormControl() 
  odlc = new FormControl() 
  commessac = new FormControl()

 
  
 
  supportf = false
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  getRowId: GetRowIdFunc<any>  = params =>params.data.nome+""+ params.data.cognome +"" +params.data.id_odl + "" + params.data.id_progetto +  params.data.anno;
  enableBrowserTooltips = true
  datiS : any[] = []
  listaColonne : string[] = []
  showForm = false;

  ngOnInit(): void {
   
    // parte di codice necessaria per il search dell'anno nel filtro 
    this.annoc.valueChanges.subscribe(data => {
      var appoggio  = this.anni2.filter(( item: {
        }) =>   {
            return (item +"") .includes((""+data))
        })
    
     this.anni = appoggio

    })

    // parte di codice necessaria per il search dell'odl nel filtro 
    this.odlc.valueChanges.subscribe(data => {
      
      var appoggio  = this.odls2.filter(( item: {
         descrizione2 : string
        }) =>   {
            return (item.descrizione2 +"").toLowerCase().includes((""+data).toLowerCase())
        })
    
     this.odls = appoggio

    })
    
    // parte di codice necessaria per il search della commessa nel filtro 
    this.commessac.valueChanges.subscribe(data => {
     
      var appoggio  = this.commesse2.filter(( item: {
         descrizione2 : string
        }) =>   {
            return (item.descrizione2.toLowerCase() +"") .includes((data +"" ).toLowerCase())
        })
    
     this.commesse = appoggio

    })
    this.form = this.fb.group({

      commessa: '',
      odl: '' ,
      anno: ''
    })
    
    //parte di codice che intercetta le modifiche  dei form ed effettua i filtri sui dati
    this.form.valueChanges.subscribe(data => {
       console.log(data)
       console.log(this.dati)
       // prendo i dati utili per il filtro nei form

       // normalizzo i dati a lista in caso il record nel form non fosse inserito
       // poicheè in caso di record non inserito il form prende '' e sarebbe difficile da gestire con un programma 
       // che si aspetta delle liste (form a selezione multipla)
       var  odl = data.odl === '' || data.odl === null || data.odl === undefined ? [] : data.odl
       var  commessa = data.commessa  === '' || data.commessa === null || data.commessa === undefined ? [] : data.commessa
       var  anno = data.anno === '' || data.anno === null || data.anno === undefined ? [] : data.anno
       console.log (odl.length , commessa.length , anno.length )

       var nuoviDati = this.dati.filter
        (( item: {
                    id_odl : string
                    id_progetto : string
                    anno : string
                 }) =>  
                    {
                      { 
                        var flag = false 
                        var flag2 = odl.length === 0 
                        var flag3 = commessa.length ===  0   
                        var flag4 = anno.length === 0 

                        for (var i in odl)
                          { 
                            if (odl[i] === undefined)
                            {
                              flag2 = true
                              break 
                            }
                            var id_odl = odl[i].descrizione2.split(":")[1]
                            
                            flag2  = flag2 || item.id_odl +"" === id_odl +""
                           


                          } 
                         
                        flag = flag2
                        for (var i in commessa)
                          { 
                            if (commessa[i] === undefined )
                            {
                              flag3 = true
                              break 
                            }
                            var id_progetto = commessa[i].descrizione2.split(":")[1]
                            flag3 = flag3 || item.id_progetto +"" === id_progetto +""
                          } 
                        flag = flag3  && flag  
                        for (var i in anno)
                          {    
                              if (anno[i]  === undefined) 
                               {
                                 flag4 = true
                                 break 
                                 
                               }
                               flag4 = flag4 || item.anno +"" === anno[i] +""
                               
                          } 
                        flag = flag4 && flag
                       
                        return flag
                      } 
                    })
          console.log(nuoviDati)
          this.agGrid.api.setRowData(nuoviDati)
       })

    // i setup servono a popolare le select delle form con i dati presi dal db 
    this.setup1()
    this.setup2()

    // prende i dati dalla tabella 'settingcolonne' del db creare lo schema della tabella
    this.strucElaboration()

    // prende i dati inerenti alla struttura elaborata da structElaboration
    this.select()
  }

  public columnDefs : ColDef[] = [{
		cellRenderer: (params : any) => {return '<div><button type="button" class="btn btn-sm"><i class="bi bi-trash-fill" style="color:red"></i></button></div>'},
		maxWidth: 34,
		filter: false,
		suppressMovable: true,
		lockPosition: 'left',
		cellClass: 'button-cell'
	}];
    
  resizeColumnWidth(){

    // ridimensiona le colonne (larghezza) basandosi sul contenuto
    // il parametro della funzione è skipHeader (considera o meno la lunghezza dell'header)
    this.agGrid?.columnApi.autoSizeAllColumns(false);
  }


	
  
 
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    
  };
  
  // Data that gets displayed in the grid
  public rowData$!: Observable<any[]>;
  private dati : any = null
  private datiV : any 

  private datvalid_livello : String = "" 
  private datvalid_ruolo : String = "" 
  

  onGridReady(params: GridReadyEvent) {
    this.agGrid.api.showNoRowsOverlay()
    this.rowData$ = new Observable<any[]>
  }
  onCellClicked( e: CellClickedEvent): void {

    var numeroC = e.column.getInstanceId()
    console.log(numeroC)
    var valore = e.column.getColId()
    var left = e.column.getLeft()
    console.log(left)
   
  }


  /*
    funzione che inizializza l'evento della modifica di una cella sulla tabella
  */
  onCellEditingStarted( e: CellEditingStartedEvent): void 
  { 
    var vecchioV = e.value; // save this value by attaching it to button or some variable
    console.log('cellEditingStarted');
    console.log(e);
    var colonna = e.colDef.field
    this.datiV = JSON.parse(JSON.stringify(e.node.data))
    console.log(this.datiV)
  }
    
  /* 
  funzione che gestisce l'effettiva modifica delle cella 
  verifica con una funzione se i dati inseriti siano validi e poi procede
  ad eseguire un update nel caso la cella fosse già popolata o 
  un insert in caso la cella non sia popolata
  */
  onCellValueChanged( e: CellValueChangedEvent): void {
    if(this.supportf){
         this.supportf= false
         return
       }

    if(e.newValue === undefined) return 
    var valore = 0
    if(e.newValue === '') {
      valore = 0;
      valore2 = 0 
      }
    else
     { 
        valore = e.newValue
        console.log("prova" , e.newValue, e.oldValue)
        var valore2 = 0
        if (e.oldValue === '' ||  e.oldValue === undefined ) {}
        else 
        {     
          console.log(e.oldValue)
          valore2 = valore - e.oldValue
          console.log(valore2)
         } 
      }
    var datiC = e.data
    console.log(datiC)
    var colonna = e.colDef.field

    console.log(e.newValue)
    var mese =  this.mappaMeseNUmero[colonna + ""]
    var anno = datiC.anno
    

    var nome = datiC.nome_risorsa
    var cognome = datiC.cognome_risorsa
    var id_risorsa = datiC.id_risorsa
    var commessa = datiC.descrizione_progetto
    console.log(e.oldValue , e.newValue)
    console.log(commessa)
    var flag_errore = false 
    this.insP.select("select * , pp.id as id2, p.id as id3  from cost_model.commesse p  left join cost_model.cost_model pp on pp.id_commessa = p.id where p.descrizione = '"+ commessa +"'").subscribe(Response=>{
    console.log(Response)
    var risposta = JSON.parse(JSON.stringify(Response))
    
    if(risposta.rowCount != 1)
    {
      Swal.fire({  
            icon: 'error',  
            title: 'errore',  
            text: "erroe di inserimento nuova attività",  
            
          }) 
          e.node.setDataValue(colonna +"", e.oldValue)
          this.supportf= true
    }
    else 
    { 
      var id_progetto = risposta.rows[0].id3
      var id_odl = risposta.rows[0].id2
      console.log(id_progetto)
      if(e.oldValue === undefined || e.oldValue === null)
      {
         
        var queryc = "SELECT new_rilatt.fnc_controllo_rendicontazione("+id_progetto+", "+id_risorsa+","+anno+","+mese+","+e.newValue+","+id_odl+");"
        console.log(queryc)
        this.insP.select(queryc).subscribe(response =>{
          
          console.log(response)
          var risposta = JSON.parse(JSON.stringify(response)) 
          if (risposta.upd === "nok")
          {   
            Swal.fire({  
              icon: 'error',  
              title: 'errore',  
              text: "erroe di formato dati",  
              
            }) 
            e.node.setDataValue(colonna +"", e.oldValue)
            this.supportf= true
            return 
          }
          console.log(risposta.rows)
          var messaggio = risposta.rows[0].fnc_controllo_rendicontazione
          console.log(messaggio)
          var tipoMessaggio : String= messaggio.split("=")[0]
          console.log(tipoMessaggio)
          var msg =  messaggio.split("=")[1]
          console.log(msg)
          if(tipoMessaggio === "OK" ||  tipoMessaggio === "WR" )
          {    
            console.log("insert")
            var query = "insert into new_rilatt.attivita_risorsa  (flag_budget , flag_attivita,giornate, id_progetto , id_risorsa , anno , mese ,id_odl)  values (false , false,"+valore+","+id_progetto+","+id_risorsa+",'"+anno+"','"+mese+"','"+id_odl+"')"
           // this.update(query)
           this.insP.select(query).subscribe(Response=>{
            var risposta = JSON.parse(JSON.stringify(Response))
            if(risposta.upd === "ok" )
            { 
               if(tipoMessaggio === "OK")
               {console.log("ok")
              Swal.fire({  
                icon: 'success',  
                title: 'successo',  
                text:  'inserimento commessa  avvenuto con successo',   
                
              }) 
            }
            else 
            { console.log("warn")
              Swal.fire({  
                icon: 'warning',  
                title: 'warning',  
                text:  msg +', il record è stato inserito ugualmente',   
                
              }) 
            }
    
            }
            else{
              console.log("err1")
              Swal.fire({  
                icon: 'error',  
                title: 'errore',  
                text: "erroe nell'inserimento di una nuova attività",  
                
              }) 
              e.node.setDataValue(colonna +"", e.oldValue)
              this.supportf= true
    
            }
              
    
           })
          }
          else 
          {
            
              if(tipoMessaggio  === "KO" )
                 {    
                      Swal.fire({  
                        icon: 'error',  
                        title: 'errore',  
                        text: msg + ", il record non verrà inserito",  
                          
                    }) 
                   }  
                   e.node.setDataValue(colonna +"", e.oldValue)   
                   this.supportf= true
                 }
       })
      }
      else 
      {  var queryc = "SELECT new_rilatt.fnc_controllo_rendicontazione("+id_progetto+", "+id_risorsa+","+anno+","+mese+","+valore2+","+id_odl+");"
      console.log(queryc)
      this.insP.select(queryc).subscribe(response =>{
        console.log(response)
        var risposta = JSON.parse(JSON.stringify(response)) 
        if (risposta.upd === "nok")
        {   
          Swal.fire({  
            icon: 'error',  
            title: 'errore',  
            text: "erroe di formato dati",  
            
          }) 
          e.node.setDataValue(colonna +"", e.oldValue)
          this.supportf= true
          return 
        }
        console.log(risposta.rows)
        var messaggio = risposta.rows[0].fnc_controllo_rendicontazione
        console.log(messaggio)
        var tipoMessaggio : String= messaggio.split("=")[0]
        console.log(tipoMessaggio)
        var msg =  messaggio.split("=")[1]
        console.log(msg)
        if(tipoMessaggio === "OK" ||  tipoMessaggio === "WR" )
        {    
          console.log("insert")
          console.log(anno, mese , nome,cognome,commessa)
        var query = "update new_rilatt.attivita_risorsa set giornate = "+(e.newValue === '' ? 0 : e.newValue) +" where id_progetto = "+ id_progetto +" and id_risorsa = " + id_risorsa +" and anno = "+anno +" and mese = " + mese
        
         console.log(query)

         this.insP.select(query).subscribe(Response=>{
          var risposta = JSON.parse(JSON.stringify(Response))
          console.log(risposta)
          if(risposta.upd === "ok" )
          { 
             if(tipoMessaggio === "OK")
             {
            Swal.fire({  
              icon: 'success',  
              title: 'successo',  
              text:  'update commessa  avvenuto con successo',   
            
              
            }) 
          }
          else 
          {
            Swal.fire({  
              icon: 'warning',  
              title: 'warning',  
              text:  msg +', il record è stato modificato ugualmente',   

              
            }) 
          }
  
          }
          else{
  
            Swal.fire({  
              icon: 'error',  
              title: 'errore',  
              text: "erroe nella modifica di una nuova attività",  
              
            }) 
            e.node.setDataValue(colonna +"", e.oldValue)
            this.supportf= true
  
          }
            
  
         })
        }
          
            if(tipoMessaggio  === "KO" )
               {    
                    Swal.fire({  
                      icon: 'error',  
                      title: 'errore',  
                      text: msg + ", il record non verrà modificato",  
                      
                        
                  }) 
                  e.node.setDataValue(colonna +"", e.oldValue)
                  this.supportf= true
                 }     
     })
        
      }
    }
    

  })
  }
   
  // le funzioni di setup servono a settare le form select.
  setup1= () => {
    var query = "select distinct   descrizione || '-' || odl || ':' ||  id as  descrizione2 from cost_model.cost_model r " 
    this.insP.select(query).subscribe(response =>{console.log(response) ;
      var dati = JSON.parse(JSON.stringify(response)).rows;  
      this.odls= dati
      this.odls2 = dati 
    
    })
    
  }
 
  setup2= () => {
    var query = "select distinct   descrizione || '-' || codice ||  ':' ||   id as descrizione2 from cost_model.commesse order by descrizione2 " 
    this.insP.select(query).subscribe(response =>{
        console.log(response) ;
        var dati = JSON.parse(JSON.stringify(response)).rows;
        this.commesse = dati; 
        this.commesse2 = dati
       })
     }


   compare = ( a : any, b : any )  => {
    if ( a.descrizione3 < b.descrizione3 ){
      return -1;
    }
    if ( a.descrizione3 > b.descrizione3 ){
      return 1;
    }
    return 0;
  }
  


 
  
  



 

select = ()  => {
  var query = "select * from new_rilatt.select_prospetto_mese()"
  this.insP.select(query).subscribe(response =>{
    console.log(response) ;
    this.dati = JSON.parse(JSON.stringify(response)).rows; console.log(this.dati);
    this.agGrid.api.setRowData(this.dati)
    this.resizeColumnWidth();
})

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
    
    }
  
  })


  strucElaboration = () => this.insP.structUndestanding("select * from new_rilatt.setting_colonne sc where maschera  = 'prospetto_mese'  order by importanza"  ).subscribe(response =>{
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

    this.agGrid.api.setColumnDefs(this.columnDefs)
    this.agGrid.columnApi.autoSizeAllColumns();
    this.resizeColumnWidth();

  
  })

 


  delete =  (query : String)   => this.insP.select(query ).subscribe(response =>{
    
  })
  




  inserisciRiga = () : void => {

    var insert1 =  JSON.parse(JSON.stringify(this.form.value))
    
   
    var id_progetto = insert1.commessa.descrizione3 === undefined ? "" : insert1.commessa.descrizione3.split(":")[1]
    var id_risorsa =  insert1.risorsa.descrizione2 === undefined ? "" :  insert1.risorsa.descrizione2.split(":")[1] 
    
  
    
  
    var anno: string =  insert1.anno === undefined || insert1.anno === null  ? "" :insert1.anno.anno  
    var mese: string =  insert1.mese === undefined || insert1.mese === null  ? "" :insert1.mese.mese
  
    var queryc = "SELECT new_rilatt.fnc_consolida_pianificazione("+id_progetto+","+anno+","+mese+")"
    console.log(queryc)
    var flag = false
    var flag2 = false
    this.insP.select(queryc).subscribe(response =>{
      console.log(response)
      var risposta = JSON.parse(JSON.stringify(response)) 
      if (risposta.upd === "nok")
      {   
        Swal.fire({  
          icon: 'error',  
          title: 'errore',  
          text: "erroe generico con la funzione : new_rilatt.fnc_consolida_pianificazione()",  
          
        }) 
        
        return 
      }
      console.log(risposta.rows)
      var messaggio = risposta.rows[0].fnc_consolida_pianificazione
      console.log(messaggio)
      var tipoMessaggio : String= messaggio.split("=")[0]
      console.log(tipoMessaggio)
      var msg =  messaggio.split("=")[1]
      console.log(msg)
      this.form.reset()
      if(tipoMessaggio =="OK" )
      {  
           Swal.fire({  
        icon: 'success',  
        title: 'successo',  
        text: messaggio,  
    
      }) 
     }
     if(tipoMessaggio =="WR" )
      {  
        Swal.fire({  
          icon: 'warning',  
          title: 'warning',  
          text: messaggio,  
          
        }) 
  
      }
      if(tipoMessaggio =="KO" )
      {  
        Swal.fire({  
          icon: 'error',  
          title: 'errore',  
          text: messaggio,  
          
        }) 
  
      }
                      
               
              
  })
     
  
  }
  

}
