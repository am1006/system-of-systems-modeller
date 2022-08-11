**_A skeleton for developing SoS modeller, used with permisson._***

# system-of-systems-modeller
System-of-systems-modeller (SOSM) is a NodeJS-based web app supported by an SQL database (MySQL) which allows a user to model nodes, their interfaces and the ways in which they connect. SOSM uses a number of client-side JS libraries which attempts to provide a clean UI, whilst also providing a clear graphical representation of the system, or the particular view of the system that the user is currently interested in.

## SOSM Terms
SOSM defines the following terms:
- Subsystem. The systems which make up the greater system.
- Interface. The means by which a platform (system) connects to other platforms (systems).
- Network. The link established between two or more interfaces.
- Feature. The technology used by a network as well as the technology that can be implemented by an interface.

## SOSM Dependencies
SOSM requires a number of external dependencies to function. Client side external dependencies can be found within /www/index.html. Client side external dependencies include:
- Bootstrap JS (4.3.1)
- Bootstrap CSS (4.6.1)
- Cytoscape JS (3.21.0)
- JQuery (3.5.1)
- ChartJS (3.7.1)

Server-side dependencies include
- MySQL (8.0.27)
- NodeJS (12.21.0)
- NPM. With packages:
-- MySQL2
