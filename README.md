# Fuel Log Application (Full-stack)

### Purpose of this Application

Fuel usage is one of the largest expenses for a company that operates and maintains a fleet of vehicles for business usage. To help keep track of the fuel usages that a company uses, an fast and easy to use application that is centered around logging instances of fuel refillments of a vehicle can give assistance to determining how much fuel different company assets require.    
   
The benefits of a fuel log application, apart from keeping track of fuel usage, are that as it records the distance travelled between fuel logs which can give other valuable information about maintainence issues for a vehicle (e.g how far a vehicle has travelled since its last maintaince, or how far the tyres have travelled since being installed etc) helps to educate the importance of better driving habits and could predicate the fuel usage in upcoming months based on the history of fuel usage from prior records.   
   
Overall the fuel usage data from vehicle assets can provide useful analytical trends for a company so that it can better manage fuel costs over the running service periods of company assets.

### Features
* Graphing and tablular reports
* Multi-vehicle tracking
* Trip and fuel usage monitoring
* Individual employee monthly usage report
* Simple and intuitive UI

### Target Audience
This application is targetted towards companies that are in need of tracking fleets of vehicles with access to fuel usage and distance data. The application uses the recorded data to generate useful reports for the company in an easy-to-understand way, allowing for the company to potentially have the ability to budget and plan for fuel expenses.

### Tech Stack
##### Application and Data
* MongoDB
* ExpressJS
* React
* NodeJS
* JavaScript
* CSS
* HTML
* AWS S3

##### Documentation
* Microsoft powerpoint
* Canva.com
* Jira
* Draw.io

### Dataflow Diagram

[Dataflow Diagram](./docs/data%20flow%20diagram/dataflow%20diagram.png)
![dataflow-diagram](./docs/data%20flow%20diagram/dataflow%20diagram.png)

- **1.0.** The employer or employee fills out a form with their login details which is submitted as a POST request. The details are verified using the stored data in D1.
- **2.0.** When the employee logs in, a GET request retrives the employee's log reports from the database.
- **3.0.** The employe fills out a form to record a log which has a vehicle selection and the form is submitted with a POST request. The submitted data is stored in D1.
- **4.0.** The employee fills out a form with their current password and new password which is then submitted and sent as a PUT request. The password is updated in D1.
- **5.0.** When the employer logs in, a GET request retrives log, vehicle, and employee data from the database.
- **6.0.** Vehicle details from the database are returned to the employer
- **7.0.** The employer fills out a form with vehicle details and selects an image to upload. The vechicle data is sent as a POST request, the image file is stored in F1 while the vechile data along with the image URL is stored in D1.
- **8.0.** When the employer selects a vehicle to delete, the vehicle ID is used to locate the vehicle record in D1 and delete the record. In F1, the image key, which is also the vehicle ID is used to locate the image file and delete it from the storage.
- **9.0.** The employer edits a form which has the current vehicle details, when the form is submitted, the data is sent as a PUT request and the vehicle data is updated in D1.
- **10.0.**  When the employer selects an employee to delete, the employee ID is used to locate the employee record in D1 and delete the record.
- **11.0.** When the employer navigates to the employees page on the employer dashboard, a GET request retrives all the employee records stored in D1.
- **12.0.** The employer fills out a form with employee details. When the form is submitted, the data is sent as a POST request. The data is stored in D1.
- **13.0.** The employer edits a form which has the current details of the employee. When the form is submitted, the data is sent as a PUT request and the record of the employee in D1 is updated with the incoming data.
- **14.0.** When the employer selects a log to delete, the log ID is used to locate the log record in D1 and delete the record.
- **15.0.** When the employer navigates to the logs page, a GET request retrives all the log records stored in D1.
- **16.0.** When the employer accepts the log deletion request, a POST request sends the log ID. The log ID is used to locate the log record in D1 and delete the record. The review log record is also deleted from D1.
- **16.1.** The log is deleted from D1 following the acceptance of the log deletion.
- **17.0.** When the employer rejects the log deletion request, the review log record is deleted.
- **17.1.** The review log record is deleted from D1 following the rejection of the log deletion.
- **18.0.** After the user has submitted a new log entry, the user can request a deletion of the log entry. When the user requests a log deletion, a record of the request is stored in D1 with the log ID and employee ID.

### Application Architecture Diagram

[Architecture Diagram](./docs/Fuel%20App%20Wireframes/Architecture%20Diagram.png)
![architecture-diagram](./docs/Fuel%20App%20Wireframes/Architecture%20Diagram.png)

### User Stories

##### User story 1
As an employer of a large trucking company, I want to be able to add/modify vehicles by using registration plates so that I can easily track different vehicles in my company

##### User story 2
As a employer of a trucking company, I want to be able to add/modify vehicles based on a specialized tagging ID system since we need this for asset management

##### User story 3
As an employee of a small electrical business, I want to be able to monitor the fuel usage of a vehicle over a time period so that I can better optimize my driving usage.

##### User story 4
As an employer, I want my employees to be able to record their trips so that it can be viewed later for analysis purposes.

##### User story 5
As an employee, I want a user friendly UI with minimual input so that I can record a log as efficiently as possible.

### Wireframes

[Mobile Wireframe](./docs/Fuel%20App%20Wireframes/Mobile.png)
![mobile-wire-frame](./docs/Fuel%20App%20Wireframes/Mobile.png)

[Tablet Wireframe](./docs/Fuel%20App%20Wireframes/Tablet.png)
![tablet-wire-frame](./docs/Fuel%20App%20Wireframes/Tablet.png)

[Desktop Wireframe](./docs/Fuel%20App%20Wireframes/Desktop.png)
![desktop-wire-frame](./docs/Fuel%20App%20Wireframes/Desktop.png)

### Jira Kanban Screenshots



