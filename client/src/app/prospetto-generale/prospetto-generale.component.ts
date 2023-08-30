import { Component, OnInit } from '@angular/core';
import { InsPService } from 'src/services/ins-p.service';
import { AgGridAngular } from 'ag-grid-angular'
import {  ViewChild } from '@angular/core';
import {FormBuilder, FormArray,FormControl,FormGroup, Validators } from '@angular/forms'
import { Observable, elementAt } from 'rxjs';
import { CellClickedEvent, CellEditingStartedEvent, CellValueChangedEvent, ColDef, Column, GetRowIdFunc, GridReadyEvent } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prospetto-generale',
  templateUrl: './prospetto-generale.component.html',
  styleUrls: ['./prospetto-generale.component.css']
})
export class ProspettoGeneraleComponent {
  constructor(private fb:FormBuilder, private http: HttpClient, private insP : InsPService){ }
  form!: FormGroup; 
  form2!: FormGroup;
  form3!: FormGroup;  
  myMap = new Map<string, string>();
  risorse: any[] = []
  risorse2: any[] = []
  risorse3: any[] = []
  commesse: any[] = []
  commesse2 : any[] = []
  commesse3 : any[] = []
  aanni : number[] =[2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050,2051,2052,2053,2054,2055]
  daanni : number[] =[2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050,2051,2052,2053,2054,2055]
  damesi : number[] =[1,2,3,4,5,6,7,8,9,10,11,12]
  amesi : number[] =[1,2,3,4,5,6,7,8,9,10,11,12]
  mesi : any[] = []
  odls : any[] = []
  odl2 : any[] = []
  odl3 : any[] = []
  anni: any[] =[] //[2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050,2051,2052,2053,2054,2055]
  disabilitato = false;
  disabilitato2 = false;
  supportf = false
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  getRowId: GetRowIdFunc<any>  = params => params.data.id_attivita;
  enableBrowserTooltips = true
  datiS : any[] = []
  listaColonne : string[] = []
  showForm = false;

  commessar = new FormControl()
  risorsar = new FormControl()
  odlr = new FormControl()

  ngOnInit(): void {
    
    this.form = this.fb.group({
      risorsa: '',
      risorsa2: '' ,
      commessa: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      anno: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      mese: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      odl: new FormControl("",[ Validators.required,Validators.minLength(1)])
    })

    this.form3 = this.fb.group({
     
      rendMens  : new  FormControl(),
      rendTot   : new  FormControl(),
      rendFitt : new  FormControl(),
      budMens : new  FormControl(),
      budTot  : new  FormControl()

    })

    

      // parte di codice necessaria per il search delle commesse nel filtro 
  this.commessar.valueChanges.subscribe(data => {
     
     var appoggio  = this.commesse2.filter(( item: {
     descrizione3 : string
    }) =>   {
        
            return (item.descrizione3 +"").toLowerCase().includes((""+data).toLowerCase())
       })

    this.commesse = appoggio
     })
// parte di codice necessaria per il search delle risorse nel filtro 
this.risorsar.valueChanges.subscribe(data => {
 
  var appoggio  = this.risorse3.filter(( item: {
     descrizione2 : string
    }) =>   {
       
        return (item.descrizione2+"").toLowerCase().includes((""+data).toLowerCase())
    })

  this.risorse2 = appoggio

})

// parte di codice necessaria per il search dell' odl nel filtro 
this.odlr.valueChanges.subscribe(data => {
 
   var appoggio  = this.odl2.filter(( item: {
     descrizione2 : string
    }) =>   {

        
        return (item.descrizione2 +"").toLowerCase().includes((""+data).toLowerCase())
    })
 
   this.odls = appoggio

})
   
    
  
    this.form.valueChanges.subscribe((data)=>{
      
      this.disabilitato = this.form.valid 
      
      var colonne = [{field : ""}]
      var datio: String =  data.odl === undefined || data.odl === null  ? undefined :data.odl.descrizione2
      var datir: string =  data.risorsa === undefined || data.risorsa === null || data.risorsa === ""  ? "" :data.risorsa.descrizione2
      var datir2: string =  data.risorsa2 === undefined || data.risorsa2 === null || data.risorsa2 === ""  ? "" :data.risorsa2.descrizione2
      var datic: string =  data.commessa === undefined || data.commessa === null || data.commessa === ""  ? "" :data.commessa.descrizione3
      var anno: string =  data.anno === undefined || data.anno === null  ? "" :data.anno.anno  
      var mese: string =  data.mese === undefined || data.mese === null  ? "" :data.mese.mese
      datic = datic === undefined ? "" : datic
      datir = datir === undefined ? "" : datir
      anno = anno === undefined ?  "" : anno
      mese = mese === undefined ? "" : mese
 
      data = data === undefined ? "" : data
      var risn =  datir === undefined ? "" : datir.split(":")[0].split("-")[0]
      risn = risn === undefined ? "" : risn
      var risc = datir === undefined ? "" : datir.split(":")[0].split("-")[1] 
      risc = risc === undefined ? "" : risc
      var descrizione = datic.split(":")[0].split("--")[0] 
      descrizione = descrizione === undefined ? "" : descrizione 
      var codice = datic.split(":")[0].split("--")[1] 
      codice = codice === undefined ? "" : codice 
    
      var risn2 =  datir2 === undefined ? "" : datir2.split(":")[0].split("-")[1]
      risn2 = risn2 === undefined ? "" : risn2
      var risc2 = datir2 === undefined ? "" : datir2.split(":")[0].split("-")[0] 
      risc2 = risc2 === undefined ? "" : risc2
      
      
     
      var odl = data.odl === undefined || data.odl === null ? "" :  data.odl.descrizione2
      odl = odl === undefined || odl.split(":")[0] === undefined ? "" :  odl.split(":")[0]
      var id_odl = datio === undefined ? "" : datio.split(":")[1]
      id_odl = id_odl === undefined ? "" : id_odl
      var descrizione_odl =  datio === undefined ? "" : datio.split(":")[0].split("--")[1]
      descrizione_odl = descrizione_odl === undefined ? "" : descrizione_odl
      var codice_odl =  datio === undefined ? "" : datio.split(":")[0].split("--")[0]
      codice_odl = codice_odl === undefined ? "" : codice_odl
       


      // filtro per la select odl scelta la commessa 
      this.odl2 = this.odl3
      this.odl2 = this.odl2.filter(element => (element.descrizione3 +"").replaceAll("." , "-").includes(codice+"") && (element.descrizione3 +"").replaceAll("." , "-").includes(descrizione+""))
      this.odls = this.odl2

      // filtro incrociato per la select commessa scelto l'odl
      console.log(this.commesse3 , codice_odl , descrizione_odl, this.commesse2)

      this.commesse2 = this.commesse3 
      this.commesse2  = this.commesse2.filter(element => (element.descrizione4 +"").includes(codice_odl ) && (element.descrizione4 +"").includes(descrizione_odl ))
      console.log(this.commesse2 )
      this.commesse  = this.commesse2

      // funzione calcolo rendicontazione e budget con funzioni fabio 
      this.datiBudget(id_odl   ,codice_odl,descrizione_odl, anno  , mese   )
    

      var filteredData = this.datiS.filter((item: {
        id_odl: string;
       
        descrizione2: string;
        descrizione3: string;
        anno: string
        mese:string
        }) => 
        
        // item.descrizione3.includes(datic)
         item.descrizione3.includes(datic)
         && (item.descrizione2+ "").includes(datir)
         &&  (item.anno === anno || anno === "")
         &&  (item.mese === mese || mese === ""))
        // &&  (item.id_odl+ "").includes(odl))
         
    var colP: any[] = []
    console.log(filteredData)
      
    
         
           colP =   [...new Map(filteredData.map(item =>
            [item["descrizione3"], item["descrizione3"].split(":")[0]])).values()];

            var filteredData2 = this.dati.filter((item: {
              id_odl : string
              cognome_risorsa: string;
              nome_risorsa: string;
              descrizione_progetto: string;
              nome: string;
              cognome: string;
              anno: string;
              mese:string
              }) =>   {
                var flag = false || datir === ""
                
                for(let t of colP )
                   {
                    var includes1 = false
                    var includes2 = false
                    for (var key in item)
                    {  
                       var key2 = key.split("---")[0]
                       
                       
                      
                       //if ((t === key2 ) && (odl === '' || odl === key3)) {console.log((t === key2 ) && (odl === '' || odl === key3));console.log(includes1);console.log(key2, t , "--",odl, "--",key3)}
                       includes1 = ((t === key2 ))  || includes1
                      // includes1 = true
                    }
                    flag = (includes1 || flag  && (descrizione in item  || descrizione === "")  )
                   }
                  
                return flag && (item.anno === anno ||  anno === "") && (item.mese === mese  ||  mese === "") && item.cognome_risorsa.includes(risc2)
              }     
            )
            this.agGrid.api.setRowData(filteredData2)
           
           
            var colonneData : string[]  = []
            for (var element in filteredData2)
            { 
             Object.keys(filteredData2[element]).forEach(key => {
            //  console.log(key)
              if (colonneData.includes(key))
              {

              }
              else 
              {
                colonneData.push(key)
              }


             }) 

            }

           
           
             colonneData = colonneData.filter((item => {
                  var flag = false 
               
              colP.forEach(it => {
                 
                if (item.includes(it) && item.includes(odl) && !item.includes("odl_") && !item.includes("flag_")) 
                  {flag = true  
                  
                  
                  }
              })

              if(flag)
              {
                 return true 
              }
              else 
              {
                return false 
              }
              

            }))
            
       
          
            this.listaColonne = this.listaColonne.filter(element => element != null)
            this.listaColonne.push('')
            this.agGrid.columnApi.setColumnsVisible(this.listaColonne, false)
          
            this.agGrid.columnApi.setColumnsVisible(colonneData,true)
            this.resizeColumnWidth();
            
    })
  
   
  
   // this.select()
    this.setup1()
    this.setup3()
    this.setup2()
    this.setup4()
   
  }
    
  resizeColumnWidth(){
    // ridimensiona le colonne (larghezza) basandosi sul contenuto
    // il parametro della funzione è skipHeader (considera o meno la lunghezza dell'header)
    this.agGrid?.columnApi.autoSizeAllColumns(false);
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


	public columnDefs : ColDef[] = [{
		cellRenderer: (params : any) => {return '<div><button type="button" class="btn btn-sm"><i class="bi bi-trash-fill" style="color:red"></i></button></div>'},
		maxWidth: 34,
		filter: false,
		suppressMovable: true,
		lockPosition: 'left',
		cellClass: 'button-cell'
	}];
  
 
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    initialWidth: 50,
    maxWidth: 400,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    
  };
  
  // Data that gets displayed in the grid
  public rowData$!: Observable<any[]>;
  private dati : any = null
  private datiV : any 
  private id_touch : String = ""
  private datvalid_livello : String = "" 
  private datvalid_ruolo : String = "" 
  
  
  // For accessing the Grid's API
   // Example load data from sever
   onGridReady(params: GridReadyEvent) {
    this.agGrid.api.showNoRowsOverlay()
    //this.agGrid.getRowId   =  params =>{return params.data.id_tutto}
    this.rowData$ = new Observable<any[]>
  }
 
  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {

  
    var colId = e.column.getColId() + ""
    var appoggio = colId.split("---")[1]
    var odl = appoggio === undefined || appoggio === null ? "" :   colId.split("---")[1].split("--")[1]
    var descrizione = appoggio === undefined || appoggio === null ? "" : colId.split("---")[1].split("--")[0]
    var anno = e.node.data.anno 
    var mese = e.node.data.mese 

  

     
    this.insP
    .select("select * from cost_model.cost_model where odl = '" + odl + "' and descrizione = '" + descrizione  +"'")
    .subscribe(element => {
         var risposta =  JSON.parse(JSON.stringify(element))
        
         if (risposta.upd === "ok" && risposta.rows.length === 1 )
         {   
             var id_odl = risposta.rows[0].id
             this.datiBudget(id_odl, descrizione ,odl , anno , mese )
         }
         else 
         {
           return 
         }


    })

    

    
    
  
  }

  onCellEditingStarted( e: CellEditingStartedEvent): void { 
    var vecchioV = e.value; // save this value by attaching it to button or some variable

    var colonna = e.colDef.field
    this.datiV = JSON.parse(JSON.stringify(e.node.data))
   
    }
onCellValueChanged( e: CellValueChangedEvent): void {
  console.log('valore modificato' , this.supportf , e.newValue, e);
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
  {     console.log(e.oldValue)
        valore2 = valore - e.oldValue
        console.log(valore2)
  } 
 }
  var datiC = e.data
  console.log(datiC)
  var colonna = e.colDef.field

  console.log(e.newValue)
  var mese = datiC.mese
  var anno = datiC.anno
  var nome = datiC.nome_risorsa
  var cognome = datiC.cognome_risorsa
  var id_risorsa = datiC.id_risorsa
  console.log("commessa")
  var commessa = e.column.getColId().split("---")[0].split("--")[0]
  console.log(commessa)


  var flag_errore = false 
  this.insP.select("select p.id , pp.id as id2, pp.odl , pp.descrizione  from cost_model.commesse p  left join cost_model.cost_model pp on pp.id_commessa = p.id where REPLACE(p.descrizione, '.' , '-') = '"+ commessa +"'").subscribe(Response=>{
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
    { console.log(risposta.rows[0])
      var id_progetto = risposta.rows[0].id
      var id_odl = risposta.rows[0].id2
      var descrizione_odl = risposta.rows[0].descrizione
      var codice_odl = risposta.rows[0].odl
      console.log(id_progetto)
      if(e.oldValue === undefined)
      {
         
        var queryc = "SELECT new_rilatt.fnc_controllo_rendicontazione("+id_progetto+", "+id_risorsa+","+anno+","+mese+","+e.newValue+","+id_odl+"," + "'insert' );"
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
          //  var appoggio = id_odl === null  ? id_odl + "'"+id_odl+"'"
            var query = "insert into new_rilatt.attivita_risorsa  (flag_budget , flag_attivita,giornate, id_progetto , id_risorsa , anno , mese ,id_odl)  values (false , false,"+valore+","+id_progetto+","+id_risorsa+",'"+anno+"','"+mese+"',"+id_odl+")"
           // this.update(query)
           this.insP.select(query).subscribe(Response=>{
            var risposta = JSON.parse(JSON.stringify(Response))
            if(risposta.upd === "ok" )
            { 
               if(tipoMessaggio === "OK")
               {
                console.log("ok")
                  Swal.fire({  
                    icon: 'success',  
                    title: 'successo',  
                    text:  'inserimento commessa  avvenuto con successo',   
                     }) 
                console.log(id_odl  ,descrizione_odl ,codice_odl, anno  , mese )
                this.datiBudget(id_odl  ,descrizione_odl ,codice_odl, anno  , mese   )
            }
            else 
            { console.log("warn")
              Swal.fire({  
                icon: 'warning',  
                title: 'warning',  
                text:  msg +', il record è stato inserito ugualmente',   
                
              }) 
              this.datiBudget(id_odl  ,descrizione_odl ,codice_odl, anno  , mese   )
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
      {  var queryc = "SELECT new_rilatt.fnc_controllo_rendicontazione("+id_progetto+", "+id_risorsa+","+anno+","+mese+","+valore2+","+id_odl+"," + "'update');"
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
        
         
         this.insP.select(query).subscribe(Response=>{
          var risposta = JSON.parse(JSON.stringify(Response))
          if(risposta.upd === "ok" )
          { 
             if(tipoMessaggio === "OK")
             {
               Swal.fire({  
              icon: 'success',  
              title: 'successo',  
              text:  'update commessa  avvenuto con successo',   
            }) 
            this.datiBudget(id_odl  ,descrizione_odl ,codice_odl, anno  , mese   )
          }
          else 
          {
            Swal.fire({  
              icon: 'warning',  
              title: 'warning',  
              text:  msg +', il record è stato modificato ugualmente',   

              
            }) 
            this.datiBudget(id_odl  ,descrizione_odl ,codice_odl, anno  , mese   )
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
 
 /* var valore = e.value
  var query = "update new_rilatt.attivita_risorsa set " + colonna + " = '" + valore +"' where id_progetto = "+datiC.id_progetto
  console.log(valore)  
  console.log(query)
  this.update(query)*/

  }
   


  setup2= () => {
    var query = "select distinct   cognome || '-' || nome ||  ':' ||   id_risorsa as descrizione2 from new_rilatt.risorse order by descrizione2 " 
    this.insP.select(query).subscribe(response =>{
        console.log(response) ;
        var dati = JSON.parse(JSON.stringify(response)).rows;
        this.risorse2= dati; 
        this.risorse3 = dati
    
    })

  }

  setup3= () => {
    var query = "select distinct   cognome || '-' || nome || ':' ||   r.id_risorsa as descrizione2 from new_rilatt.risorse r "
              +" inner join new_rilatt.odl r2  on  r.id_risorsa = r2.id_risorsa order by descrizione2 " 
    this.insP.select(query).subscribe(response =>{console.log(response) ;
      var dati = JSON.parse(JSON.stringify(response)).rows;  
      this.risorse=  [...new Map(dati.map((item: { [x: string]: any; }) =>
      [item["descrizione2"], item])).values()];
    
    })
    
  }
  setup4= () => {
    var query = `select   o.descrizione || '--'  ||o.odl || ':' || o.id  as descrizione2 ,
                  c.descrizione || '--'  ||c.codice || ':' || c.id  as descrizione3 
                  from cost_model.cost_model o
                  inner join cost_model.commesse c  on c.id = o.id_commessa
                  order by descrizione2 ` 
    this.insP.select(query).subscribe(response =>{
      var dati = JSON.parse(JSON.stringify(response)).rows;  
      this.odls= dati
      this.odl2 = dati
      this.odl3 = dati
    
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


  setup1= () => {
    var query = `select distinct  p2.id,    cognome || '-' || nome ||  ':'  ||   
    r2.id_risorsa as descrizione2, REPLACE(p.descrizione, '.', '-') || '--' ||  REPLACE(codice, '.', '-')   || ':' || p.id as descrizione3 
    , anno,mese , 
     p2.descrizione || '--'  || p2.odl || ':' || p2.id  as descrizione4 from new_rilatt.attivita_risorsa ar 
     inner join cost_model.commesse p  on p.id  = ar.id_progetto
     left join cost_model.cost_model p2 on p2.id = ar.id_odl
     left join new_rilatt.risorse r2 on r2.id_risorsa  = ar.id_risorsa  order by descrizione2 `

    this.insP.select(query).subscribe(response =>{
     
      var dati = JSON.parse(JSON.stringify(response)).rows;
      this.commesse =  [...new Map(dati.map((item: { [x: string]: any; }) =>
      [item["descrizione3"], item])).values()];
      console.log(this.commesse , dati)
      this.commesse2 = this.commesse
      this.commesse3 = this.commesse

      this.datiS = dati
     
     // this.commesse = dati
  
     this.mesi =  [...new Map(dati.map((item: { [x: string]: any; }) =>[item["mese"], item])).values()];
     this.mesi = this.mesi.sort(function(a,b) { return a.mese-b.mese}); 
  
     this.anni =    [...new Map(dati.map((item: { [x: string]: any; }) =>
      [item["anno"], item])).values()].sort();
    this.strucElaboration()
       })
      }


 
  
  



 

select = ()  => {var query = "select *, p.descrizione_progetto as progetti from new_rilatt.attivita_risorsa ar inner join new_rilatt.risorse r on r.id_risorsa = ar.id_risorsa " +
"inner join new_rilatt.progetti  p on p.id_progetto = ar.id_progetto "

this.insP.select(query).subscribe(response =>{
  this.dati = JSON.parse(JSON.stringify(response)).rows; 
  this.agGrid.api.setRowData(this.dati)
  this.resizeColumnWidth();
})

}
 
  update = (query : String)   => this.insP.select(query).subscribe(response =>{
    var risposata = JSON.parse(JSON.stringify(response)) 
    if(risposata.upd === "ok")
    {
          console.log("update andato a buon fine")
    }
    else 
    { console.log("errore")
       
      this.agGrid.api.applyTransaction({update:[this.datiV]});
      Swal.fire({  
        icon: 'error',  
        title: 'ERRORE',  
        text: 'errore di update, codice : '+ risposata.code
        
      })  
    
    }
  
  })


  strucElaboration = () =>{
  var query = `select  distinct  tc.descrizione as livello_risorsa , pp.id,id_attivita , p.id  ,REPLACE(p.descrizione, '.' , '-')  || '--' || REPLACE(p.codice, '.' , '-') ||   (case when pp.id is null then '' else  '---' ||pp.descrizione || '--' || pp.odl  end) as descrizione_progetto ,p.codice, r.id_risorsa as id_pm,r.nome as nome_pm,r.cognome as cognome_pm , 
   r2.nome as nome_risorsa,r2.id_risorsa,r2.cognome as cognome_risorsa,ar.anno ,ar.mese,ar.giornate ,ar.flag_attivita 
   from cost_model.commesse p 
   join new_rilatt.attivita_risorsa ar 
   on ar.id_progetto =p.id 
   left join cost_model.cost_model pp 
   on pp.id=ar.id_odl 
   left join new_rilatt.risorse r 
   on r.id_risorsa =ar.id_risorsa 
   join new_rilatt.risorse r2 
   on r2.id_risorsa =ar.id_risorsa 
   left join new_rilatt.risorse_livello rl on rl.id_risorsa = r2.id_risorsa
   and DATE(date_trunc('MONTH', to_date(concat(ar.anno * 100 + ar.mese , '01'), 'YYYYMMDD')) + interval '1 MONTH - 1 day')
   between rl.dtinizio_livello and coalesce (rl.dtfine_livello,
   to_date('21001231', 'yyyymmdd'))  
   left join cost_model.tipi_costi tc on tc.id = rl.id_livello
   order by pp.id  `
   

   //backup vecchia query
   /* 
    `select  distinct  pp.id_odl,id_attivita , p.id_progetto  ,REPLACE(p.descrizione_progetto, '.' , '-')  || '--' || REPLACE(p.codice, '.' , '-') ||   (case when pp.id_odl is null then '' else  '---' ||pp.codice_odl || '--' || pp.descrizione_odl  end) as descrizione_progetto ,p.codice, r.id_risorsa as id_pm,r.nome as nome_pm,r.cognome as cognome_pm ,"
   r2.nome as nome_risorsa,r2.id_risorsa,r2.cognome as cognome_risorsa,ar.anno ,ar.mese,ar.giornate ,ar.flag_attivita from"
   new_rilatt.progetti p"
   join new_rilatt.attivita_risorsa ar"
   on ar.id_progetto =p.id_progetto"
   left join new_rilatt.odl pp"
   on pp.id_odl =ar.id_odl"
   left join new_rilatt.risorse r"
   on r.id_risorsa =pp.id_risorsa"
   join new_rilatt.risorse r2"
   on r2.id_risorsa =ar.id_risorsa order by id_odl`
   
   */
 
    this.insP.structUndestanding(query ).subscribe(response =>{
 
    var responsej = JSON.parse(JSON.stringify(response))
    
    console.log(responsej)
    this.elaborazioneStruttura(response);
    this.resizeColumnWidth();
  })}

  elaborazioneStruttura  = (json : Object) =>{
    var listaR = JSON.parse(JSON.stringify(json)).rows.filter(
  (element: { descrizione_progetto: null; }) => element.descrizione_progetto != null)
    this.columnDefs.push({"field" : "id_risorsa"  , editable : true , hide : true }) 
    this.columnDefs.push({"field" : "id_attivita"  , editable : true , hide : true }) 
    this.columnDefs.push({"field" : "nome_risorsa"  , editable : false , hide : false}) 
    this.columnDefs.push({"field" : "cognome_risorsa"  , editable : false , hide : false}) 
    this.columnDefs.push({"field" : "livello_risorsa"  , editable : false , hide : false}) 
    this.columnDefs.push({"field" : "anno"  , editable : false , hide : false}) 
    this.columnDefs.push({"field" : "mese"  , editable : false , hide : false}) 
    var listaD:any = [{}]
    var listaD2:any = []
    var nuoviDati = {}
    var contatore = 0
    for( let element of listaR ) {
      let found2 = listaD2.findIndex((item: any)  => { 
        return  item.nome_risorsa === element.nome_risorsa
        && item.cognome_risorsa === element.cognome_risorsa 
        && item.anno === element.anno 
        && item.mese === element.mese } );

      if (found2 === -1)
      { 
        
        var t : any = {  "id_odl" : element.id_odl, "id_risorsa":element.id_risorsa,"id_attivita" : element.id_attivita, "contatore" : contatore, "livello_risorsa" : element.livello_risorsa,"nome_risorsa" : element.nome_risorsa , "cognome_risorsa" : element.cognome_risorsa , "anno" : element.anno , "mese" : element.mese } 
        var descrizione  =(element.descrizione_progetto+"")
        t[descrizione] = element.giornate
        t["flag_" + descrizione] = element.flag_attivita
        t["odl_" + descrizione] = element.id_odl
        listaD2.push(t)
      
        
      }
      else 
      {    
             
            
             var descrizione = (element.descrizione_progetto+"")
             var valore = (element.giornate+"")
             var it = listaD2[found2]
             it[descrizione] = valore
             it["flag_" + descrizione] = element.flag_attivita
             it["odl_" + descrizione] = element.id_odl
         
             listaD2[found2] = it
      }
    
      contatore = contatore +1 
      let found = listaD.find((item: any)  => { return item === element.descrizione_progetto  } );
      

      if (found === undefined){
        this.listaColonne.push(element.descrizione_progetto)
        this.columnDefs.push({  "field" : element.descrizione_progetto  ,  headerTooltip: element.codice,   cellStyle: params => {
          if (params.data["flag_"+element.descrizione_progetto]) {
              //mark police cells as red
              
              return {color: 'black', backgroundColor: '#FFCCCB'};
          }
          return {color: 'black', backgroundColor: '#FFFFFF'};
      } ,editable: (params) => !params.data["flag_"+element.descrizione_progetto], hide : false ,  resizable: true}) 
        this.columnDefs.push({
          "field" : "odl_"+element.descrizione_progetto,
          headerTooltip: element.codice,
          editable: (params) => !params.data["flag_"+element.descrizione_progetto],
          hide : true,
          resizable: true,
        }) 
        
        listaD.push(element.descrizione_progetto)
      }
      else 
      {
     
      }
    
   
    };
  
    this.dati = listaD2
   
    this.agGrid.api.setRowData(this.dati)
    
    this.agGrid.api.setColumnDefs(this.columnDefs)
    this.agGrid.columnApi.setColumnsVisible([], false)


  }


  delete =  (query : String)   => this.insP.select(query ).subscribe(response =>{
    /*console.log(response)
    var risposata = JSON.parse(JSON.stringify(response)) 
    if(risposata.upd === "ok")
    {
          console.log("delete  andato a buon fine "+ this.id_touch)
          this.agGrid.api.applyTransaction({remove:[{id_attivita : this.id_touch}]});
    }
    else 
    { console.log("errore")
    
       
      
      Swal.fire({  
        icon: 'error',  
        title: 'errore',  
        text: 'errore in delete, codice : ' + risposata.code
      
      })  
    }*/
  
  })




  inserisciRiga = () : void => {

    var insert1 =  JSON.parse(JSON.stringify(this.form.value))
    
   
    var id_progetto = insert1.commessa.descrizione3 === undefined ? "" : insert1.commessa.descrizione3.split(":")[1]
    var id_risorsa =  insert1.risorsa.descrizione2 === undefined ? "" :  insert1.risorsa.descrizione2.split(":")[1] 
    var id_odl =    insert1.odl.descrizione2    === undefined ? "" :  insert1.odl.descrizione2.split(":")[1]
    var anno: string =  insert1.anno === undefined || insert1.anno === null  ? "" :insert1.anno.anno  
    var mese: string =  insert1.mese === undefined || insert1.mese === null  ? "" :insert1.mese.mese
  
    var queryc = "SELECT new_rilatt.fnc_consolida_pianificazione("+id_progetto+","+id_odl+","+anno+","+mese+")"
    var flag = false
    var flag2 = false
    console.log(queryc)
    this.insP.select(queryc).subscribe(response =>{
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
      var messaggio = risposta.rows[0].fnc_consolida_pianificazione
      var tipoMessaggio : String= messaggio.split("=")[0]
      var msg =  messaggio.split("=")[1]
      console.log(tipoMessaggio)
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
      if(tipoMessaggio != "KO" && tipoMessaggio != "OK" && tipoMessaggio != "WR")
      {
        Swal.fire({  
          icon: 'error',  
          title: 'errore generico non previsto',  
          text: messaggio,  
          
        }) 
      }
                      
               
              
  })
     
  
  }
  

}
