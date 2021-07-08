FROM python:3.9.6-buster

#
#ARG ALGENCAN=/algencan

#
#RUN mkdir /app
#COPY . /app

#
COPY ./requirements.txt /tmp/
#COPY ./resources/algencan-3.1.1.tgz /tmp/

# gfortran
#RUN  apt-get install gfortran -y

# algencan
#RUN tar -zxvf algencan-3.1.1.tgz
#RUN mv algencan /
#WORKDIR /algencan
#RUN make
#RUN mkdir tmp
#WORKDIR /algencan/tmp
#RUN if [[ ! -f ./app/script/teste.x ]]; then gfortran ./app/script/packmod.f90 ./app/script/studentpack.f90 -L$ALGENCAN/lib -lalgencan -o ./app/script/teste.x fi

# python
RUN pip install --upgrade pip
RUN pip install --requirement /tmp/requirements.txt

#
WORKDIR /app
