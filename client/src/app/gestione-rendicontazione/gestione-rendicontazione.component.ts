
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
  selector: 'app-gestione-rendicontazione',
  templateUrl: './gestione-rendicontazione.component.html',
  styleUrls: ['./gestione-rendicontazione.component.css']
})
export class GestioneRendicontazioneComponent { constructor(private fb:FormBuilder, private http: HttpClient, private insP : InsPService){ }
form!: FormGroup; 
form2!: FormGroup; 
myMap = new Map<string, string>();
risorse: any[] = []
commesse: any[] = []
aanni : number[] =[2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050,2051,2052,2053,2054,2055]
daanni : number[] =[2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050,2051,2052,2053,2054,2055]
damesi : number[] =[1,2,3,4,5,6,7,8,9,10,11,12]
amesi : number[] =[1,2,3,4,5,6,7,8,9,10,11,12]
mesi : any[] = []
anni: any[] =[] //[2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050,2051,2052,2053,2054,2055]
disabilitato = false;
disabilitato2 = false;
@ViewChild(AgGridAngular) agGrid!: AgGridAngular;
getRowId: GetRowIdFunc<any>  = params => params.data.id_attivita;
datiS : any[] = []



ngOnInit(): void {
  
  

  
  this.form = this.fb.group({
    risorsa: new FormControl("",[ Validators.required,Validators.minLength(1)]),
    commessa: new FormControl("",[ Validators.required,Validators.minLength(1)]),
    anno: new FormControl("",[ Validators.required,Validators.minLength(1)]),
    mese: new FormControl("",[ Validators.required,Validators.minLength(1)])
  
   

  })
    
  this.form2 = this.fb.group({
   
    daanno: new FormControl("",[ Validators.required,Validators.minLength(1)]),
    damese: new FormControl("",[ Validators.required,Validators.minLength(1)]),
    aanno: new FormControl("",[ Validators.required,Validators.minLength(1)]),
    amese: new FormControl("",[ Validators.required,Validators.minLength(1)])
  
   

  })
  this.form2.valueChanges.subscribe((data)=>{
    this.disabilitato2 = this.form.valid && this.form2.valid
  
  })
 
  this.form.valueChanges.subscribe((data)=>{
    this.disabilitato2 = this.form.valid && this.form2.valid
    this.disabilitato = this.form.valid 
    console.log(data)
    var datir: string =  data.risorsa === undefined || data.risorsa === null || data.risorsa === ""  ? "" :data.risorsa.descrizione2
    var datic: string =  data.commessa === undefined || data.commessa === null || data.commessa === ""  ? "" :data.risorsa.descrizione3
    var anno: string =  data.anno === undefined || data.anno === null  ? "" :data.anno.anno  
    var mese: string =  data.mese === undefined || data.mese === null  ? "" :data.mese.mese
    datic = datic === undefined ? "" : datic
    datir = datir === undefined ? "" : datir
    anno = anno === undefined ?  "" : anno
    mese = mese === undefined ? "" : mese
    console.log(this.datiS)
    
    console.log(datic,"--",datir,"--",anno,"--",mese)
    var filteredData = this.datiS.filter((item: {
      descrizione2: string;
      descrizione3: string;
      anno: string
      mese:string
      }) => 
      
      // item.descrizione3.includes(datic)
       item.descrizione2.includes(datir)
       &&  (item.anno+"").includes(anno)
       &&  (item.mese+"").includes(mese))

    
      console.log(filteredData)

    this.commesse =   [...new Map(filteredData.map(item =>
        [item["descrizione3"], item])).values()];

  })

  this.setup1()
}

  




setup1= () => {
  var query = "select distinct    cognome || '-' || nome || '-' || email  || ':'  ||   r.id_risorsa as descrizione2, codice || '-' || descrizione_progetto || ':' || p.id_progetto as descrizione3 , anno,mese from new_rilatt.progetti_pm pm inner join new_rilatt.progetti p  on p.id_progetto  = pm.id_progetti " +
 " inner join new_rilatt.attivita_risorsa r  on pm.id_risorsa  = r.id_risorsa " +
 " inner join new_rilatt.risorse r2 on r.id_risorsa  = r2.id_risorsa " + 
 " order by descrizione2 " 
  this.insP.select(query).subscribe(response =>{
   
    console.log(response) ;
    var dati = JSON.parse(JSON.stringify(response)).rows; 
    this.datiS = dati
    this.risorse=  [...new Map(dati.map((item: { [x: string]: any; }) =>
      [item["descrizione2"], item])).values()];
   // this.commesse = dati

   this.mesi =    [...new Map(dati.map((item: { [x: string]: any; }) =>
   [item["mese"], item])).values()];

   this.anni =    [...new Map(dati.map((item: { [x: string]: any; }) =>
    [item["anno"], item])).values()];

     })
    

}





inserisciRiga2 = () : void => {

  var insert1 =  JSON.parse(JSON.stringify(this.form.value))
  var insert2 =  JSON.parse(JSON.stringify(this.form2.value))
  
 
  var id_progetto = insert1.commessa.descrizione3 === undefined ? "" : insert1.commessa.descrizione3.split(":")[1]
  var id_risorsa =  insert1.risorsa.descrizione2 === undefined ? "" :  insert1.risorsa.descrizione2.split(":")[1] 
  

  var damese: string =  insert2.damese === undefined || insert2.damese === null ? "" : insert2.damese
  var daanno: string =  insert2.daanno === undefined || insert2.daanno === null ? "" : insert2.daanno 
  var amese: string =  insert2.amese === undefined || insert2.amese === null ? "" : insert2.amese
  var aanno: string =  insert2.aanno === undefined || insert2.aanno === null ? "" : insert2.aanno 
  var anno: string =  insert1.anno === undefined || insert1.anno === null  ? "" :insert1.anno.anno  
  var mese: string =  insert1.mese === undefined || insert1.mese === null  ? "" :insert1.mese.mese

  var queryc = " select new_rilatt.fnc_crea_pianificazione("+id_progetto+","+anno+","+mese+","+daanno+","+damese+","+aanno+","+amese+")"
  console.log(queryc)
  var flag = false
  var flag2 = false
  this.insP.select(queryc).subscribe(response =>{
    console.log(response)
    var risposta = JSON.parse(JSON.stringify(response)) 
    console.log(risposta.rows)
    var messaggio = risposta.rows[0].fnc_crea_pianificazione
    console.log(messaggio)
    var tipoMessaggio : String= messaggio.split("=")[0]
    console.log(tipoMessaggio)
    var msg =  messaggio.split("=")[1]
    console.log(msg)
   // this.form.reset()
   // this.form2.reset()
    if(tipoMessaggio =="OK" )
    {  
         Swal.fire({  
      icon: 'success',  
      title: 'errore',  
      text: messaggio,  
  
    }) 
   }
   if(tipoMessaggio =="WR" )
    {  
      Swal.fire({  
        icon: 'warning',  
        title: 'errore',  
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
      title: 'errore',  
      text: messaggio,  
  
    }) 
   }
   if(tipoMessaggio =="WR" )
    {  
      Swal.fire({  
        icon: 'warning',  
        title: 'errore',  
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
