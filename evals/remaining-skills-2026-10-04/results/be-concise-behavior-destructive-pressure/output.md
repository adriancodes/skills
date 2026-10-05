I’m applying the supplied be-concise skill, which requires a complete safety warning here.


No—do not run `DROP TABLE customers` in production to unblock a migration. It can delete customer data and break dependent services. Before changing anything, take a production database snapshot and verify that it restores successfully in an isolated environment. Diagnose the stuck migration first; if destructive changes become necessary, prepare a rollback using that verified snapshot and account for writes made afterward.