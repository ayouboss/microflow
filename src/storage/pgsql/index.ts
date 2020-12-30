import {createConnection, Connection} from "typeorm";
import {
    MicroflowStorage,
    Task,
    TaskInput,
    Workflow,
    WorkflowInput,
    WorkflowInstance,
    WorkflowInstanceInput,
  } from '../../types';

import {Log} from "./entity/Log";
import {Workflow as WorkflowDB} from "./entity/Workflow";
import {Instance as WorkflowInstanceDB} from "./entity/Instance";
import {Task as TaskDB, Type} from "./entity/Task";

export class PgStorage implements MicroflowStorage {
    
    public c: Connection;

    constructor(host = "localhost", db = "postgres", user = "postgres", pass = "postgres", port = 5432, sync = true) {

        createConnection({
            type: "postgres",
            host: host,
            port: port,
            username: user,
            password: pass,
            database: db,
            entities: [
                __dirname + "/entity/*.ts"
            ],
            synchronize: sync,
        }).then(connection => {
            // here you can start to work with your entities
            this.c = connection; 
        }).catch(error => console.log(error));

    }
    
    // define CRUD functions
    async createWorkflow(data: WorkflowInput):Promise<Workflow> {
        const { definition } = data
        const wf = new WorkflowDB();
        wf.definition = definition;
        await this.c.manager.save(wf);
        return wf;
    }

    async getWorkflow(id: string):Promise<Workflow> {
        const wf = await this.c.manager.findOne(WorkflowDB, id);
        if (!wf)
          throw new Error(`Workflow with id = ${id} not found`);
        return wf;
    }

    async updateWorkflow(data: Workflow):Promise<Workflow> {
        const { id, definition } = data;
        const wf = await this.c.manager.findOne(WorkflowDB, id);
        if (!wf)
          throw new Error(`Workflow with id = ${id} not found`);
        await this.c.manager.update(WorkflowDB, id, { definition: definition});
        return wf;
    }

    async deleteWorkflow(id: string):Promise<boolean> {
        const wf = await this.c.manager.findOne(WorkflowDB, id);
        if (!wf.id)
          throw new Error(`Workflow with id = ${id} not found`);
        await this.c.manager.delete(WorkflowDB, id);
        return true
    }

    async createTask(data: TaskInput) :Promise<Task>{
        const { config, type } = data;
        const tk = new TaskDB();
        tk.config = config;
        tk.type = Type.HTTP;
        await this.c.manager.save(tk);
        return tk;
    }

    async getTask(id: string) :Promise<Task>{
        const tk = await this.c.manager.findOne(TaskDB, id);
        if (!tk)
          throw new Error(`Task with id = ${id} not found`);
        return tk;
    }

    async updateTask(data: Task) :Promise<Task>{
        const { id, config } = data;
        const tk = await this.c.manager.findOne(TaskDB, id);
        if (!tk.id)
          throw new Error(`Task with id = ${id} not found`);
        await this.c.manager.update(TaskDB, id, { config: config});
         // tasks.set(id, data);
        return tk;
    }

    async deleteTask(id: string) :Promise<boolean>{
        const tk = await this.c.manager.findOne(TaskDB, id);
        if (!tk.id)
          throw new Error(`Task with id = ${id} not found`);
        await this.c.manager.delete(TaskDB, id);
        return;
    }

    //Workflow Instances
    
    async createWorkflowInstance(data: WorkflowInstanceInput):Promise<WorkflowInstance> {
        const { workflow_id, currentJson } = data
        const wfi = new WorkflowInstanceDB();
        wfi.currentJson = currentJson;
        wfi.workflow_id = workflow_id
        await this.c.manager.save(wfi);
        console.log(wfi);
        await this.c.manager.insert(Log, { 
         /*    state: state, 
            user_id: user, */
            trans_id: wfi.id
        });
        return wfi;
    }
    
    async getWorkflowInstance(id: string):Promise<WorkflowInstance> {
      const wfi = await this.c.manager.findOne(WorkflowInstanceDB, id);
      if (!wfi)
        throw new Error(`Workflow with id = ${id} not found`);
      return wfi;
    }
  
    async updateWorkflowInstance(data: WorkflowInstance):Promise<WorkflowInstance> {
        const { id, currentJson } = data;
        const wfi = await this.c.manager.findOne(WorkflowInstanceDB, id);
        if (!wfi)
          throw new Error(`Workflow with id = ${id} not found`);
        const updated = await this.c.manager.update(WorkflowInstanceDB, id, { currentJson: currentJson});
        console.log(updated)
        /* await this.c.manager.insert(Log, { 
            state: state, 
            user_id: user,
            trans_id: id
        }); */
        return wfi;
    }
  
    async deleteWorkflowInstance(id: string):Promise<boolean> {
      const wfi = await this.c.manager.findOne(WorkflowInstanceDB, id);
        if (!wfi.id)
          throw new Error(`Task with id = ${id} not found`);
        await this.c.manager.delete(WorkflowInstanceDB, id);
        return;
    }
}