# School of Computing &mdash; Year 4 Project Proposal Form



## SECTION A

### Project Member Details

| Project Title:      | TwoDrive            |
| ------------------- | ------------------- |
| Student 1 Name:     | Michael Collins     |
| Student 1 ID:       | 16313231            |
| Student 2 Name:     | Ikenna Festus Ejike |
| Student 2 ID:       | 14383451            |
| Project Supervisor: | Stephen Blott       |



## SECTION B

### Introduction

TwoDrive is a project that aims to cover topics including *private cloud technology*, *file system storage solutions*, *cryptography*, and *RESTful APIs*. Our aim for the development cycle is to employ a test-driven development approach to ensure a robust product from start to finish and to keep track of our progress using tools such as Git and Trello.

### Outline

The purpose of TwoDrive is to provide a centralized, easy-to-use, First-Party private cloud solution for DCU students and faculty. We plan to achieve this by having a desktop client that automatically synchronises specified file systems to the cloud to provide back-ups, while also allowing the files to be accessed from any machine the user wishes. The user may access their files from a web client, and they may also upload/download other files of their choosing to the cloud with the assurance that their data is stored securely and safely on the premises of DCU.

We are currently proposing two clients, one for the desktop to synchronise files, and another on the web where a user may view, add, and remove files of their choosing. Given that we cannot have access to DCU's servers to install this ourselves, we are going to include an installation process that would assist a server admin in setting up the application. This will not hinder our project itself, as a proof of concept will still be presented by substituting DCU's server with another machine.

### Background

The idea for TwoDrive came from our shared distrust of Third-Party applications. With the rise of Third-Party authentication, cloud solutions, and other applications there is an often overlooked fact that we as consumers are trusting our identities and our data with companies that we have no reason to trust.

We knew pretty early what our problem was, but we were unsure as to what avenue we would like to pursue with our solution. We initially thought of tackling the issue of trusting our identities with Third-Party applications (e.g. signing in with Facebook using OAuth 2.0). However, after some research we saw that companies such as Microsoft and IBM have their greatest minds theorizing about solutions to the same problem, and this led us to look at what we can do about our data.

We are all familiar with Google Drive, Dropbox, and similar products. They do their job, but there are the ever-present security issues that come with these platforms. The companies have access to our data, and may view things that we wish to keep private. Furthermore, we are not in control of the availability of our data. Whether or not our data is there tomorrow, or our accounts for that matter is in control of the companies that we are entrusting with our data. This is what led us to the idea of TwoDrive.

We wanted to develop a solution that put the control of the data back in the users' hands. Taking DCU as an example, we wanted to develop a storage solution that fulfilled the same requirements as the aforementioned products without the caveat of trusting a Third-Party entity. We wanted privacy to be normalized in our digital lives as it is in our everyday lives.

### Achievements

The main function that the project will provide is that of a storage solution that is not bound by location or by the storage capacity of the users' hard-drives. Using asymmetrical cryptography, we also plan to achieve a truly private cloud experience for the users.

These users may be anybody; We plan to include an installation guide with the project, thus allowing anybody to set up the application on their machine. This will give full privacy and autonomy over one's data to anyone who can spare the time to set it up. We are marketing the project towards DCU as a whole as it may be easily white-labelled under DCU, and thus the users would be DCU students and faculty members, or whomever DCU would deem a user under their advisement.

### Justification

Sticking with the idea of the application being white-labelled and installed on DCU's servers, the application will be useful because it provides functionality similar to well-known cloud platforms without the unnecessary element of trust. While DCU undoubtedly has its storage solutions, this provides a central location for users to access all of their relevant data and work. This may range from pictures with their friends taken in Nubar, to sensitive information that a user would prefer not to store outside DCU's premises.

We believe that the platform would see most of its active users during the academic year, with a lot of the holiday periods being primarily used for cold-storage purposes. The advantages of our solution as opposed to something like the H: Drives found in DCU's computer labs, is TwoDrive's portability. Our solution also has advantages over Third-Party cloud platforms, namely its First-Party nature, but also that it may be integrated into DCU's other applications after the fact, perhaps for assignment submissions or other such works.

### Programming language(s)

The project will be written using a full JavaScript stack. We will use Cassandra for our database, and we will implement Docker for virtualisation.

### Programming tools / Tech stack

Starting with the back-end, we propose using *Cassandra* for the database layer due to its focus on availability. For the API and server, we will be using a standard *NodeJS* and *Express* setup, as it is expandable and reliable. We have several front-end technologies that we seek to use. We suggest using *Electron* for this, as it is a clean and widely used tool for desktop clients. For the web application, we suggest a *React-Redux* setup, as it is one of the most widely used web-client tools and thus has ample support and extensions. *React Native* is also useful for making sites accessible on phones. We also wish to use *Docker* to virtualize the setup and increase the availability of the application through the use of features such as snapshots.

### Hardware

We do not plan to use any hardware during our project. Testing and development will be done on our machines.

### Learning Challenges

Using Docker is a new experience for us both, as are the front-end technologies that are listed above, yet we plan to overcome this using online resources such as blogs, forums, and videos.

### Breakdown of work

#### Student 1

Student 1 will be responsible for the majority of the back-end, this includes the database, the APIs, and server-side operations. They will also be responsible for Docker implementation, and the cryptography tools used on the files. They will ensure that availability and security are top priorities.

#### Student 2

Student 2 will be responsible for most of the front-end, this includes the multiple clients and the user experience. They will be responsible for creating a clean user interface and connecting this with the back-end APIs. They will ensure that usability and security are top priorities.

#### Students 1 & 2

Both students will help each other with their respective roles where suitable and will work together on implementing an installer, and all necessary documentation, etc.