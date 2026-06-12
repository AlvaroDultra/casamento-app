package com.casamento.config;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Usa o conector NIO2 do Tomcat. No Windows o NIO2 trabalha com I/O Completion
 * Ports (IOCP) em vez do par de sockets loopback que o NIO padrão cria para o
 * wakeup do selector — evitando o erro "Unable to establish loopback connection"
 * quando há firewall/antivírus bloqueando conexões loopback efêmeras.
 */
@Configuration
public class TomcatConfig {

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> nio2Customizer() {
        return factory ->
                factory.setProtocol("org.apache.coyote.http11.Http11Nio2Protocol");
    }
}
