importPackage(org.jboss.as.cli.scriptsupport) 

importPackage(java.io);
importPackage(java.lang);
importPackage(java.util);


Date.prototype.format = function() 
{
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	var hh = this.getHours().toString();
	var MM = this.getMinutes().toString();
	var ss = this.getSeconds().toString();
	
	return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]) + " " + (hh[1]?hh:"0"+hh[0]) + ":" + (MM[1]?MM:"0"+MM[0]) + ":" + (ss[1]?ss:"0"+ss[0]); // padding
};
 
cli = CLI.newInstance() 
cli.connect("127.0.0.1", 9999, "jboss", ['j','b','o','s','s','!','2','3','4']) 
 
result = cli.cmd(":read-attribute(name=product-name)")
pname = result.getResponse().get("result").asString()

result = cli.cmd(":read-attribute(name=product-version)")
pversion = result.getResponse().get("result").asString()
 
result = cli.cmd(":read-attribute(name=release-version)")
prelease = result.getResponse().get("result").asString() 

HealthCheckArray=
{
	"HealthCheck" : { "Date" : new Date().format() }
}

HealthCheckArray.HealthCheck.ProductName = String(pname)
HealthCheckArray.HealthCheck.ProductVersion = String(pversion)
HealthCheckArray.HealthCheck.ProductReplease = String(prelease)

		try
		{

			result = cli.cmd("/core-service=platform-mbean/type=memory:read-attribute(name=heap-memory-usage)")
			initheap = result.getResponse().get("result").get("init").asDouble()
			usedheap = result.getResponse().get("result").get("used").asDouble()  
			
			result = cli.cmd("/core-service=platform-mbean/type=memory:read-attribute(name=non-heap-memory-usage)")
			noninitheap = result.getResponse().get("result").get("init").asDouble() 
			nonusedheap = result.getResponse().get("result").get("used").asDouble()  
			memory=usedheap+nonusedheap

			result = cli.cmd("/core-service=platform-mbean/type=runtime:read-attribute(name=system-properties)")
			servername = result.getResponse().get("result").get("SERVER").asString()
			hostname = result.getResponse().get("result").get("jboss.host.name").asString()

			SERVER={ 
					"host" : String(hostname) , 
					"servername" : String(servername) , 
					"memory" : 
							{
								"InitHeap" : String(initheap),
								"UsageHeap" : String(usedheap),
								"NonInitHeap" : String(noninitheap),
								"NonUsageHeap" : String(nonusedheap),
								"TotalMemory" : String(memory)
							}
					}
			

			result = cli.cmd("/subsystem=threads/unbounded-queue-thread-pool=ajp-uq-thread-pool:read-resource(include-runtime=true)")
			current_thread_count = result.getResponse().get("result").get("current-thread-count").asString()
			active_count = result.getResponse().get("result").get("active-count").asString()
			max_threads  = result.getResponse().get("result").get("max-threads").asString()

			if(max_threads!="undefined")
			{
				SERVER.ajpthread=
				{
					"CurrentThreadCount" : String(current_thread_count),
					"ActiveCount" : String(active_count),
					"MaxThreads" : String(max_threads)
				}
			}

			// DataSource List
			datasources=["jpetstore","oracleds","CmsDS","IscreamDS","AmailDS","isPushDS"]

			SERVER.datasources=[]

			for(datasource=0;datasource<datasources.length;datasource++)
			{
		 
					DATA_SOURCE="/subsystem=datasources/data-source="+datasources[datasource]
					result = cli.cmd(DATA_SOURCE + ":read-resource(include-runtime=true,recursive=true)")
					jndiname = result.getResponse().get("result").get("jndi-name").asString()
					max_pool_size = result.getResponse().get("result").get("max-pool-size").asString()
					min_pool_size = result.getResponse().get("result").get("min-pool-size").asString()
					result = cli.cmd(DATA_SOURCE + "/statistics=pool:read-resource(include-runtime=true)")
					ActiveCount = result.getResponse().get("result").get("ActiveCount").asString()
					InUseCount = result.getResponse().get("result").get("InUseCount").asString()
					MaxUsedCount = result.getResponse().get("result").get("MaxUsedCount").asString()

					if(jndiname != "undefined")
					{  

						SERVER.datasources.push
						(
							{
								"Name" : String(datasources[datasource]),
								"JNDIName" : String(jndiname),
								"min-pool-size" : String(min_pool_size),
								"max-pool-size" : String(max_pool_size),
								"ActiveCount" : String(ActiveCount),
								"InUseCount" : String(InUseCount),
								"MaxUsedCount" : String(MaxUsedCount),
							}
						)


					} 
			}
		}
		catch(e)
		{
			//print(e)
		}

HealthCheckArray.HealthCheck.SERVER=[]
HealthCheckArray.HealthCheck.SERVER.push(SERVER)

var HealthString = JSON.stringify(HealthCheckArray);
print(HealthString)

cli.disconnect()

