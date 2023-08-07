# Import libraries
import os 
import sys
import openai
import json
import langchain.agents as lc_agents
import uvicorn
import pydantic


# Import custom modules
from datetime import datetime
from dotenv import load_dotenv
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import SequentialChain, SimpleSequentialChain, LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.llms import OpenAI as lang_open_ai
from pydantic import BaseModel
from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware






class Item(pydantic.BaseModel):
    language: str
    topic: str
    

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

 


@app.get("/ping")
def ping():
    return {"message": "Hello World"}

@app.post("/generate_code/")
async def generate_code(item:Item,apikey: str = Header(None) ):
    global api_key
    
    api_key = apikey
    # Check if the API key has been saved in the memory
    if not api_key:
        api_key = api_key
        
    else:
        # The API key has already been saved, so don't re-assign it
        pass
    
    
    os.environ["OPENAI_API_KEY"] =  api_key  #item.apikey
    
    code_language = item.language
    code_topic = item.topic 

    # prompt template for the code generation
    code_template = PromptTemplate(
    input_variables=['lang', 'top'],
    template='Write the code in ' +
    ' {lang} language' + ' for {top}'\
    + ' with proper inline comments and maintaining \
        markdown format of {lang}'
    )

    code_explain_template = PromptTemplate(
    input_variables=['top'],
    template='Explain in detail the working of the generated code and algorithm ' +
    ' for {top}' + ' in proper markdown format'
    )
    code_flow_template = PromptTemplate(
    input_variables=['top'],
    template='Generate the diagram flow  ' +
    ' for {top} in proper markdown format'
    )

    code_testcase_template = PromptTemplate(
    input_variables= ['lang', 'top'],
    template='Generate the unit test cases and codes ' +
    'and integration test cases with codes  ' +
    'in  {lang}' + ' for {top} in proper  markdown formats'
    )

    # use memory for the conversation
    code_memory = ConversationBufferMemory(
        input_key='top', memory_key='chat_history')
    explain_memory = ConversationBufferMemory(
        input_key='top', memory_key='chat_history')
    flow_memory = ConversationBufferMemory(
        input_key='top', memory_key='chat_history')
    testcase_memory = ConversationBufferMemory(
        input_key='top', memory_key='chat_history')

    # create the  OpenAI LLM model
    open_ai_llm = OpenAI( temperature=0.7, max_tokens=1000)

    # create a chain to generate the code
    code_chain = LLMChain(llm=open_ai_llm, prompt=code_template,
                      output_key='code', memory=code_memory, verbose=True)
    #  create another chain to explain the code 
    code_explain_chain = LLMChain(llm=open_ai_llm, prompt=code_explain_template,
                          output_key='code_explain', memory=explain_memory, verbose=True)



    #  create another chain to generate the code flow if needed
    code_flow_chain = LLMChain(llm=open_ai_llm, prompt=code_flow_template,
                          output_key='code_flow', memory=flow_memory, verbose=True)

    #  create another chain to generate the code flow if needed
    code_testcase_chain = LLMChain(llm=open_ai_llm, prompt=code_testcase_template,
                          output_key='code_unittest', memory=testcase_memory, verbose=True)
    
    # create a sequential chain to combine both chains
    sequential_chain = SequentialChain(chains=[code_chain, code_explain_chain, code_flow_chain,\
                                           code_testcase_chain], input_variables=
                                   ['lang', 'top'], output_variables=['code', 'code_explain','code_flow', 'code_unittest'])


    response = sequential_chain({'lang': code_language, 'top': code_topic})
    
   
    return  {'code': response['code'], 'code_explain': response['code_explain'],\
             'code_flow': response['code_flow'], 'code_unittest': response['code_unittest']}
    

   



